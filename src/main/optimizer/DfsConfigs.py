dfs_configs = {
    'fd': {
        'mlb': {
            'main': {
                'lineup_matrix': ['P', 'C 1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'C 1B 2B 3B SS OF'],
                'display_matrix': ['P', 'C/1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF', 'Util'],
                'salary_cap': 35000
            }
        },
        'nfl': {
            'main': {
                'lineup_matrix': ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'RB WR TE', 'DST'],
                'display_matrix': ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'D/ST'],
                'salary_cap': 60000
            },
            'mvp': {
                'display_matrix': ['MVP (1.5x Points)', 'FLEX', 'FLEX', 'FLEX', 'FLEX'],
                'salary_cap': 60000
            }
        },
        'nba': {
            'main': {
                'lineup_matrix': ['PG', 'PG', 'SG', 'SG', 'SF', 'SF', 'PF', 'PF', 'C'],
                'display_matrix': ['PG', 'PG', 'SG', 'SG', 'SF', 'SF', 'PF', 'PF', 'C'],
                'salary_cap': 60000
            }
        }
    },
    'dk': {
        'mlb': {
            'main': {
                'lineup_matrix': ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF'],
                'display_matrix': ['P', 'P', 'C', '1B', '2B', '3B', 'SS', 'OF', 'OF', 'OF'],
                'salary_cap': 50000
            }
        },
        'nfl': {
            'main': {
                'lineup_matrix': ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'RB WR TE', 'DST'],
                'display_matrix': ['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'D/ST'],
                'salary_cap': 50000
            },
            'mvp': {
                'display_matrix': ['MVP (1.5x Points)', 'FLEX', 'FLEX', 'FLEX', 'FLEX', 'FLEX'],
                'salary_cap': 50000
            }
        },
        'nba': {
            'main': {
                'lineup_matrix': ['PG', 'SG', 'SF', 'PF', 'C', 'PG SG', 'SF PF', 'PG SG SF PF C'],
                'display_matrix': ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'Util'],
                'salary_cap': 50000
            }
        }
    }
}
