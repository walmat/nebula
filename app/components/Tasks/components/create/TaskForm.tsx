import ShopifyDialog from './ShopifyForm';
import SupremeDialog from './SupremeForm';
import YeezySupplyDialog from './YeezySupplyForm';
import FootsiteDialog from './FootsiteForm';
import PokemonDialog from './PokemonForm';
import { Platforms } from '../../../../tasks/common/constants';

const PLATFORM_FORM = {
  [Platforms.Shopify]: ShopifyDialog,
  [Platforms.Supreme]: SupremeDialog,
  [Platforms.YeezySupply]: YeezySupplyDialog,
  [Platforms.Footsites]: FootsiteDialog,
  [Platforms.Pokemon]: PokemonDialog
};

export const getPlatformComponent = (platform: string) => {
  if (platform in PLATFORM_FORM) {
    return PLATFORM_FORM[platform];
  }

  return ShopifyDialog;
};
