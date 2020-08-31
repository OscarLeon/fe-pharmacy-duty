import Axios from 'axios';
import { config } from '../config';

export default {
  getPharmaciesByCommuneAndLocal(requestPharmacy) {
    // const urlBackEnd = Configuration.value('apiUrl');
    const urlBackEnd = 'http://localhost:3000/v1/api';

    const postData = {
      communeName: requestPharmacy.communeName,
      localName: requestPharmacy.localName
    };

    return Axios.post(
      `${urlBackEnd}${config.endpoint.getPharmacies}`,
      postData
    );
  }
};
