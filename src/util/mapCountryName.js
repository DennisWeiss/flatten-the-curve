const mapCountryName = country => {
  const countryMap = {
    'North Macedonia': 'Macedonia',
    'US': 'United States of America',
    'Korea, South': 'South Korea',
    'Czechia': 'Czech Republic',
    'Congo (Kinshasa)': 'Democratic Republic of the Congo',
    'Cote d\'Ivoire': 'Ivory Coast',
  }
  if (country in countryMap) {
    return countryMap[country]
  }
  return country
}

export {mapCountryName}