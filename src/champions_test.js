const axios = require('axios');

const objectMap = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v.key]));

const getChampions = async () => {
  await axios
    .get('http://ddragon.leagueoflegends.com/cdn/11.18.1/data/en_US/champion.json')
    .then((res) => {
      const { data } = res.data;
      console.log(objectMap(data));
      return data;
    });
};

const parserChampions = async () => {
  const data = await getChampions();
  console.log(data);
  // const championsJson = objectMap(data);
  // console.log(championsJson);
};

// parserChampions();

getChampions();

module.exports = {
  parserChampions,
};
