import { BasePokemonTask } from './base';

import { PokemonContext } from '../../../common/contexts';

export const choosePokemonTask = () => {
  return (context: PokemonContext) => new BasePokemonTask(context);
};
