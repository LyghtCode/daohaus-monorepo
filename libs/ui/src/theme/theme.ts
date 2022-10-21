import { Theme } from '../types/theming';

import {
  primary,
  primaryDark,
  secondary,
  secondaryDark,
  secondaryDarkA,
  neutral,
  neutralDark,
  utility,
  utilityDark,
  dangerDark,
  warningDark,
  successDark,
  success,
  danger,
  warning,
  info,
  infoDark,
  primaryDarkA,
  primaryA,
  secondaryA,
} from './global/colors';

import {
  PrimaryDarkButton,
  SecondaryDarkButton,
  TertiaryDarkButton,
  SuccessDarkButton,
  WarningDarkButton,
  DangerDarkButton,
  PrimaryLightButton,
  SecondaryLightButton,
  TertiaryLightButton,
  SuccessLightButton,
  WarningLightButton,
  DangerLightButton,
} from './atoms/button';
import { AppSwitcherDark, AppSwitcherLight } from './organisms/app-switcher';

export const defaultDarkTheme: Theme = {
  themeName: 'dark',
  transparent: 'transparent',
  rootBgColor: neutralDark.step1,
  rootFontColor: secondaryDark.step12,
  primary: { ...primaryDark },
  primaryA: { ...primaryDarkA },
  secondary: { ...secondaryDark },
  secondaryA: { ...secondaryDarkA },
  success: { ...successDark },
  warning: { ...warningDark },
  danger: { ...dangerDark },
  info: { ...infoDark },
  neutral: { ...neutralDark },
  // *** ATOMS *** //
  button: {
    primary: PrimaryDarkButton,
    secondary: SecondaryDarkButton,
    tertiary: TertiaryDarkButton,
    success: SuccessDarkButton,
    warning: WarningDarkButton,
    danger: DangerDarkButton,
  },
  // *** MOLECULES *** //
  toast: {
    icon: {
      default: successDark.step9,
      success: successDark.step9,
      warning: warningDark.step9,
      error: dangerDark.step9,
    },
  },
  // *** ORGANISMS *** //
  appSwitcher: AppSwitcherDark,
};

export const defaultLightTheme: Theme = {
  themeName: 'light',
  transparent: 'transparent',
  rootBgColor: secondary.step1,
  rootFontColor: secondary.step12,
  primary: { ...primary },
  primaryA: { ...primaryA },
  secondary: { ...secondary },
  secondaryA: { ...secondaryA },
  success: { ...success },
  warning: { ...warning },
  danger: { ...danger },
  info: { ...info },
  neutral: { ...neutral },
  // *** ATOMS *** //
  button: {
    primary: PrimaryLightButton,
    secondary: SecondaryLightButton,
    tertiary: TertiaryLightButton,
    success: SuccessLightButton,
    warning: WarningLightButton,
    danger: DangerLightButton,
  },
  // *** MOLECULES *** //
  toast: {
    icon: {
      default: success.step9,
      success: success.step9,
      warning: warning.step9,
      error: danger.step9,
    },
  },
  // *** ORGANISMS *** //
  appSwitcher: AppSwitcherLight,
};
