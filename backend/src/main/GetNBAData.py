from .DFSFunctions import *


def get_nba_projections():
    if is_offseason('nba'):
        return 'offseason'
