from flask import Flask, jsonify, request
from flask_cors import CORS
from nba_api.stats.endpoints import PlayerGameLog, LeagueGameLog, \
    ShotChartDetail, LeagueLeaders, LeagueDashTeamClutch, \
    LeagueDashPlayerClutch, LeagueDashTeamStats, LeagueDashPlayerStats
from nba_api.stats.static import players, teams
from nba_api.stats.library.parameters import SeasonType, PerModeSimple
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Helper function to get player ID
def get_player_id(name):
    return players.find_players_by_full_name(name)[0]['id']


@app.route('/team-players', methods=['GET'])
def get_team_players():
    team_name = request.args.get('team_name')
    season = request.args.get('season', '2024-25')

    if not team_name:
        return jsonify({"error": "team_name is required"}), 400

    try:
        # Find the team dictionary from the static teams list
        team_list = teams.get_teams()
        team_info = next(
            (team for team in team_list if team['full_name'] == team_name),
            None)

        if not team_info:
            return jsonify({"error": "Invalid team name"}), 400

        team_abbr = team_info['abbreviation']

        # Get league-wide player logs to filter players by team and season
        league_log = LeagueGameLog(season=season,
                                   season_type_all_star='Regular Season',
                                   player_or_team_abbreviation='P')
        df = league_log.get_data_frames()[0]

        # Filter to only include players from this team
        df_team_players = df[df['TEAM_ABBREVIATION'] == team_abbr]

        # Get unique player names
        unique_players = sorted(df_team_players['PLAYER_NAME'].unique().tolist())

        return jsonify(unique_players)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/player-plus-minus', methods=['GET'])
def get_player_plus_minus():
    # Get query parameters
    player_name = request.args.get('player_name')
    season = request.args.get('season', '2024-25')

    # Validate inputs
    if not player_name:
        return jsonify({"error": "player_name is required"}), 400

    try:
        # Get player ID
        player_id = get_player_id(player_name)

        # Player game log
        player_log = PlayerGameLog(player_id=player_id, season=season,
                                   season_type_all_star='Regular Season')
        player_df = player_log.get_data_frames()[0][
            ['Game_ID', 'GAME_DATE', 'MATCHUP', 'WL', 'PLUS_MINUS']]
        player_df.rename(columns={'Game_ID': 'GAME_ID'}, inplace=True)

        # League game log 
        league_log = LeagueGameLog(season=season,
                                   season_type_all_star='Regular Season',
                                   player_or_team_abbreviation='P')
        league_df = league_log.get_data_frames()[0]

        # Infer TEAM_ID by matching GAME_ID and PLAYER_ID
        league_player_df = league_df[league_df['PLAYER_ID'] == player_id][
            ['GAME_ID', 'TEAM_ID']]
        player_df = pd.merge(player_df, league_player_df, on='GAME_ID',
                             how='left')

        # Get unique team IDs for the player
        team_ids = player_df['TEAM_ID'].unique()

        # League game log (team-level)
        league_team_log = LeagueGameLog(season=season,
                                        season_type_all_star='Regular Season',
                                        player_or_team_abbreviation='T')
        league_team_df = league_team_log.get_data_frames()[0]

        results = []

        # Process each team the player was part of
        for team_id in team_ids:
            # Filter for the player's team
            team_df = league_team_df[league_team_df['TEAM_ID'] == team_id][
                ['GAME_ID', 'PTS', 'MATCHUP']]
            team_df.rename(
                columns={'PTS': 'TEAM_PTS', 'MATCHUP': 'TEAM_MATCHUP'},
                inplace=True)

            # Also extract opponent scores from the same league_df
            opp_df = league_team_df[league_team_df['TEAM_ID'] != team_id][
                ['GAME_ID', 'TEAM_ID', 'PTS']]
            opp_df.rename(columns={'PTS': 'PTS_OPP'}, inplace=True)

            # Filter player logs for this team
            player_team_df = player_df[player_df['TEAM_ID'] == team_id]

            # Merge on GAME_ID
            merged = pd.merge(player_team_df, team_df, on='GAME_ID')
            merged = pd.merge(merged, opp_df, on='GAME_ID')
            merged['POINT_DIFF'] = merged['TEAM_PTS'] - merged['PTS_OPP']
            merged['FINAL_SCORE'] = merged['TEAM_PTS'].astype(str) + "-" + merged['PTS_OPP'].astype(str)

            # Convert to JSON and append to results
            team_results = merged[['GAME_DATE', 'MATCHUP', 'WL', 'PLUS_MINUS', 'POINT_DIFF', 'FINAL_SCORE']].to_dict(orient='records')
            results.extend(team_results)

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/league-plus-minus', methods=['GET'])
def get_league_plus_minus():
    # Get query parameters
    season = request.args.get('season', '2024-25')
    team_abbreviation = request.args.get('team')
    limit = int(request.args.get('limit', 25))

    try:
        # Fetch game logs for all players in the league
        league_log = LeagueGameLog(season=season,
                                   season_type_all_star='Regular Season',
                                   player_or_team_abbreviation='P')
        league_df = league_log.get_data_frames()[0]

        # Filter relevant columns
        player_logs = league_df[
            ['PLAYER_ID', 'PLAYER_NAME', 'TEAM_ABBREVIATION', 'GAME_ID',
             'PLUS_MINUS']]

        # Filter by team if `team_abbreviation` is provided
        if team_abbreviation:
            player_logs = player_logs[
                player_logs['TEAM_ABBREVIATION'] == team_abbreviation]

        # Aggregate plus/minus by player
        player_plus_minus = player_logs.groupby(
            ['PLAYER_ID', 'PLAYER_NAME', 'TEAM_ABBREVIATION']).agg(
            total_plus_minus=('PLUS_MINUS', 'sum'),
            avg_plus_minus=('PLUS_MINUS', 'mean'),
            games_played=('GAME_ID', 'count')
        ).reset_index()

        # Sort by total plus/minus (descending) and limit the results
        player_plus_minus = player_plus_minus.sort_values(by='total_plus_minus',
                                                          ascending=False).head(
            limit)

        # Convert to JSON
        results = player_plus_minus.to_dict(orient='records')

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/teams', methods=['GET'])
def get_teams():
    try:
        # Fetch all teams using nba_api
        all_teams = teams.get_teams()

        # Extract relevant fields (name and abbreviation)
        team_list = [
            {"name": team["full_name"], "abbreviation": team["abbreviation"],"id":team["id"]}
            for team in all_teams]

        # Sort the list alphabetically by team name
        sorted_team_list = sorted(team_list, key=lambda x: x["name"])

        return jsonify(sorted_team_list)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/seasons', methods=['GET'])
def get_seasons():
    try:
        current_year = pd.Timestamp.now().year

        # If it's before October, the current season hasn't started yet
        if pd.Timestamp.now().month < 10:
            current_year -= 1

        # Generate the last 10 seasons
        seasons = [f"{year}-{str(year + 1)[-2:]}" for year in range(current_year - 9, current_year + 1)][::-1]

        return jsonify(seasons)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/player-shot-chart', methods=['GET'])
def get_shot_chart():
    # Get query parameters
    player_name = request.args.get('player_name')
    season = request.args.get('season', '2024-25')

    # Validate inputs
    if not player_name:
        return jsonify({"error": "player_name is required"}), 400

    try:
        # Get player ID
        player_id = get_player_id(player_name)

        # Fetch shot chart data
        shot_chart = ShotChartDetail(
            player_id=player_id,
            team_id=0,
            season_nullable=season,
            season_type_all_star='Regular Season',
            context_measure_simple='FGA'
        )

        # Extract the data frame
        shot_df = shot_chart.get_data_frames()[0]

        # Calculate shooting percentages by zone
        # Group by SHOT_ZONE_BASIC
        zone_basic = shot_df.groupby('SHOT_ZONE_BASIC').agg(
            attempted_shots=('SHOT_ATTEMPTED_FLAG', 'sum'),
            made_shots=('SHOT_MADE_FLAG', 'sum')
        ).reset_index()
        zone_basic['shooting_percentage'] = (zone_basic['made_shots'] / zone_basic['attempted_shots']) * 100

        # Group by SHOT_ZONE_AREA
        zone_area = shot_df.groupby('SHOT_ZONE_AREA').agg(
            attempted_shots=('SHOT_ATTEMPTED_FLAG', 'sum'),
            made_shots=('SHOT_MADE_FLAG', 'sum')
        ).reset_index()
        zone_area['shooting_percentage'] = (zone_area['made_shots'] / zone_area['attempted_shots']) * 100

        # Group by SHOT_ZONE_RANGE
        zone_range = shot_df.groupby('SHOT_ZONE_RANGE').agg(
            attempted_shots=('SHOT_ATTEMPTED_FLAG', 'sum'),
            made_shots=('SHOT_MADE_FLAG', 'sum')
        ).reset_index()
        zone_range['shooting_percentage'] = (zone_range['made_shots'] / zone_range['attempted_shots']) * 100

        # Combine all breakdowns into a single dictionary
        shooting_percentages = {
            "zone_basic": zone_basic.to_dict(orient='records'),
            "zone_area": zone_area.to_dict(orient='records'),
            "zone_range": zone_range.to_dict(orient='records'),
        }

        # Combine raw shot data and shooting percentages in the response
        response = {
            "shot_data": shot_df.to_dict(orient='records'),
            "shooting_percentages": shooting_percentages
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/team/clutch',methods=['GET'])
def get_team_clutch_stats():
    team_id = request.args.get('team_id')
    season = request.args.get('season','2024-25')
    
    try:
        team_clutch_stats = LeagueDashTeamClutch(
            team_id_nullable=team_id,
            season = season,
            season_type_all_star='Regular Season',
            per_mode_detailed=PerModeSimple.per_game
        )

        #exttract data frame
        data = team_clutch_stats.get_data_frames()[0]

        clutch_data = data.to_dict(orient='records')

        return jsonify(clutch_data)
    except Exception as e:
        return jsonify({"error":str(e)}), 400


@app.route('/team/stats', methods=['GET'])
def get_team_stats():
    team_id = request.args.get('team_id')
    quarter = request.args.get('quarter')
    season = request.args.get('season','2024-25')
    is_defense = request.args.get("defense")
    
    measure_type = "Base"

    if is_defense:
        measure_type = "Defense"

    if not quarter:
        quarter = 0
    
    try:
        team_stats = LeagueDashTeamStats(
            team_id_nullable=team_id,
            period=quarter,
            season = season,
            season_type_all_star='Regular Season',
            measure_type_detailed_defense=measure_type,
            per_mode_detailed=PerModeSimple.per_game
        )

        #exttract data frame
        data_frame = team_stats.get_data_frames()[0]

        team_data = data_frame.to_dict(orient='records')

        return jsonify(team_data)
    except Exception as e:
        return jsonify({"error":str(e)}), 400


@app.route('/player', methods=['GET'])
def get_player():
    player_name = request.args.get('player_name')

    if player_name: 
        player = players.find_players_by_full_name(player_name)
        return jsonify(player)

    season = request.args.get('season', '2024-25')

    try:
        league_log = LeagueGameLog(season=season,
                                   season_type_all_star='Regular Season',
                                   player_or_team_abbreviation='P')
        df = league_log.get_data_frames()[0]

        # Get unique player names
        unique_players = df[['PLAYER_NAME', 'PLAYER_ID']].drop_duplicates().to_dict(orient='records')

        return jsonify(unique_players)
    except Exception as e:
        return jsonify({"error":str(e)})


@app.route('/players/clutch', methods=['GET'])
def get_player_clutch_stats():
    player_id = request.args.get("player_id")
    player_name = request.args.get('player_name')
    season = request.args.get('season','2024-25')

    if not player_id:
        player_id = get_player_id(player_name)

    try:
        player_clutch_stats=LeagueDashPlayerClutch(
            season=season,
            season_type_all_star=SeasonType.regular,
            per_mode_detailed=PerModeSimple.per_game
            )
        

        data = player_clutch_stats.get_data_frames()[0]
        
        filtered_data = data[data['PLAYER_ID'] == int(player_id)]

        clutch_data = filtered_data.to_dict(orient='records')
        return jsonify(clutch_data)
    except Exception as e:
        return jsonify({"error":str(e)}), 400 


@app.route('/players/stats', methods=['GET'])
def get_player_stats():
    player_id = request.args.get('player_id')
    player_name = request.args.get('player_name')
    quarter = request.args.get('quarter')
    season = request.args.get('season','2024-25')
    is_defense = request.args.get("defense")
    
    measure_type = "Base"

    if is_defense:
        measure_type = "Defense"

    if not quarter:
        quarter = 0

    if not player_id:
        player_id = get_player_id(player_name)
    
    try:
        team_stats = LeagueDashPlayerStats(
            period=quarter,
            season = season,
            season_type_all_star='Regular Season',
            measure_type_detailed_defense=measure_type,
            per_mode_detailed=PerModeSimple.per_game
        )

        #exttract data frame
        data_frame = team_stats.get_data_frames()[0]

        filtered_data = data_frame[data_frame['PLAYER_ID'] == int(player_id)]



        team_data = filtered_data.to_dict(orient='records')

        return jsonify(team_data)
    except Exception as e:
        return jsonify({"error":str(e)}), 400



if __name__ == '__main__':
    app.run(debug=True)
 