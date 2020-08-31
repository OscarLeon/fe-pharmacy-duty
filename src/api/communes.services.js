import Axios from 'axios';
import { config } from '../config';

export default {
  getCommunes(stateID) {
    // const urlBackEnd = Configuration.value('apiUrl');
    const urlBackEnd = 'http://localhost:3000/v1/api';

    return Axios.get(`${urlBackEnd}${config.endpoint.getCommunes}${stateID}`);
  }
};
