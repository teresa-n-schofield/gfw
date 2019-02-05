import { getAdmin } from 'services/forest-data';
import axios from 'axios';
import range from 'lodash/range';
import groupBy from 'lodash/groupBy';

export default ({ params }) =>
  axios
    .all([
      getAdmin({ ...params }),
      getAdmin({ ...params, indicator: 'plantations' })
    ])
    .then(
      axios.spread((admin, plantations) => {
        const adminData = admin.data && admin.data.data;
        const plantData = plantations.data && plantations.data.data;

        const adminByYear = groupBy(
          adminData.reduce((acc, d) => acc.concat(d.year_data), []),
          'year'
        );
        const plantByYear = groupBy(
          plantData.reduce((acc, d) => acc.concat(d.year_data), []),
          'year'
        );

        const maxYear = Math.max(
          Object.keys(adminByYear),
          Object.keys(plantByYear)
        );

        return {
          adminData: adminByYear,
          plantData: plantByYear,
          years: range(2013, maxYear + 1)
        };
      })
    );
