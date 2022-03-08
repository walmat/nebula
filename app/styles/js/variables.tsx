// TODO - move this to theme provider
export default () => {
  return {
    sizes: {
      toolbarHeight: 48
    },
    styles: {
      darkPalette: {
        background: '#202126',
        secondary: '#2E2F34',
        color: '#fff',
        heading: '#f4f4f4',
        inverse: '#000',
        checkbox: '#616161',
        card: '#2E2F34',
        subtext: '#d8d8d8',
        contrast: '0',
        iconColor: '#f4f4f4',
        navHeader: 'grey',
        navBackground: '#202126',
        navText: '#f4f4f4',
        border: '#2E2F34',
        boxShadow: '#202126',
        main: '#8E83F4'
      },
      lightPalette: {
        background: '#f4f4f4',
        secondary: '#fff',
        color: '#000',
        heading: '#616161',
        inverse: '#fff',
        checkbox: '#616161',
        card: '#d8d8d8',
        subtext: '#737373',
        contrast: '1',
        iconColor: '#616161',
        navHeader: '#d8d8d8',
        navBackground: '#f5f5f5',
        navText: '#616161',
        border: '#979797',
        boxShadow: '#f4f4f4',
        main: '#8E83F4'
      },
      primaryColor: {
        main: '#8E83F4',
        secondary: '#fff',
        hover: 'rgba(255,255,255, 0.5)'
      },
      secondaryColor: {
        main: '#fff',
        secondary: '#8E83F4',
        primary: 'rgba(255,255,255, 0.833)'
      },
      sidebar: {
        header: '#D8D8D8',
        active:
          'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)'
      },
      regularFontSize: 14,
      textLightColor: `rgba(0, 0, 0, 0.64)`
    }
  };
};
