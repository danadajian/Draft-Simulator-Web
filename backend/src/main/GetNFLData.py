from backend.src.main.DFSFunctions import *


def get_nfl_projections():
    if is_offseason('nfl'):
        return 'offseason'
