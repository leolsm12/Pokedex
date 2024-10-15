export interface BasePokemon {
    id: number;
    name: string;
    url: string;
    image: string;
    types: string[] | null;  
}

export interface Pokemon extends BasePokemon {
    height?: number;
    weight?: number;
    stats: PokemonStat[];  
    urlSpecies: any;  
    urlChainEvo?: any;
    evolutionChain?: PokemonEvo[];
}

export interface PokemonStat {
    name: string;
    base_stat: number;
}

export interface PokemonEvo {
    evo1: any;
    evo2: any;
    evo3: any;
}

export interface UrlPokeEvo {
    urlChainEvo: any;
}