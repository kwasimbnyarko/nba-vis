from flask import Flask, jsonify, request
from flask_cors import CORS
from nba_api.stats.endpoints import PlayerGameLog, LeagueGameLog, ShotChartDetail
from nba_api.stats.static import players
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Helper function to get player ID
def get_player_id(name):
    return players.find_players_by_full_name(name)[0]['id']


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
        player_log = PlayerGameLog(player_id=player_id, season=season, season_type_all_star='Regular Season')
        player_df = player_log.get_data_frames()[0][['Game_ID', 'GAME_DATE', 'MATCHUP', 'WL', 'PLUS_MINUS']]
        player_df.rename(columns={'Game_ID': 'GAME_ID'}, inplace=True)

        # League game log 
        league_log = LeagueGameLog(season=season, season_type_all_star='Regular Season', player_or_team_abbreviation='P')
        league_df = league_log.get_data_frames()[0]

        # Infer TEAM_ID by matching GAME_ID and PLAYER_ID
        league_player_df = league_df[league_df['PLAYER_ID'] == player_id][['GAME_ID', 'TEAM_ID']]
        player_df = pd.merge(player_df, league_player_df, on='GAME_ID', how='left')

        # Get unique team IDs for the player
        team_ids = player_df['TEAM_ID'].unique()

        # League game log (team-level)
        league_team_log = LeagueGameLog(season=season, season_type_all_star='Regular Season', player_or_team_abbreviation='T')
        league_team_df = league_team_log.get_data_frames()[0]

        results = []

        # Process each team the player was part of
        for team_id in team_ids:
            # Filter for the player's team
            team_df = league_team_df[league_team_df['TEAM_ID'] == team_id][['GAME_ID', 'PTS', 'MATCHUP']]
            team_df.rename(columns={'PTS': 'TEAM_PTS', 'MATCHUP': 'TEAM_MATCHUP'}, inplace=True)

            # Also extract opponent scores from the same league_df
            opp_df = league_team_df[league_team_df['TEAM_ID'] != team_id][['GAME_ID', 'TEAM_ID', 'PTS']]
            opp_df.rename(columns={'PTS': 'PTS_OPP'}, inplace=True)

            # Filter player logs for this team
            player_team_df = player_df[player_df['TEAM_ID'] == team_id]

            # Merge on GAME_ID
            merged = pd.merge(player_team_df, team_df, on='GAME_ID')
            merged = pd.merge(merged, opp_df, on='GAME_ID')
            merged['POINT_DIFF'] = merged['TEAM_PTS'] - merged['PTS_OPP']

            # Convert to JSON and append to results
            team_results = merged[['GAME_DATE', 'MATCHUP', 'WL', 'PLUS_MINUS', 'TEAM_PTS', 'PTS_OPP', 'POINT_DIFF']].to_dict(orient='records')
            results.extend(team_results)

        return jsonify(results)

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

        # Convert to JSON
        shot_data = shot_df.to_dict(orient='records')

        return jsonify(shot_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)