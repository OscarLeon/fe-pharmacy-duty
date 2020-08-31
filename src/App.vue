<template>
  <div id="app">
    <div class="container">
      <div class="row mt-4">
        <div class="col-12">
          <h1>Farmacias en Turno</h1>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-12">
          <p class="text-center">
            Te invitamos a encontrar tu farmacia usando los filtros de busqueda
            para mejorar tu experiencia.
          </p>
          <p class="text-center mt-2">¡Adelante!</p>
        </div>
      </div>

      <div class="row d-flex justify-content-center mt-2">
        <div class="col-sm-8">
          <div class="alert alert-warning">
            <p class="text-justify">
              En caso de que vivas o te dirijas a una comuna que esté en
              cuarentena, recuerda sacar un permiso temporal hasta dos veces por
              semana. Para visitar el sitio comisaria virtual haz click aqui
              <strong
                ><a
                  class="color-black"
                  href="http://www.comisariavirtual.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  >comisariavirtual.cl</a
                ></strong
              >
            </p>
          </div>
        </div>
      </div>

      <div class="row mt-2 d-flex justify-content-center">
        <div class="col-md-8">
          <form method="POST" @submit.prevent="onSubmit">
            <div class="form-row d-flex justify-content-center">
              <div class="form-group col-md-12">
                <label for="inputCommune">Comuna</label>
                <select
                  id="inputCommune"
                  class="form-control"
                  @change="getOptionValue($event)"
                >
                </select>
              </div>
              <div class="form-group col-md-12">
                <label for="inputLocal">Farmacia</label>
                <input
                  type="text"
                  class="form-control"
                  id="inputLocal"
                  placeholder="Ingrese una farmacia de preferencia"
                  v-model="formPharmacy.localName"
                  autocomplete="off"
                />
              </div>
            </div>
            <div class="form-group row mt-2 d-flex justify-content-center">
              <div class="col-md-8 d-flex justify-content-center">
                <button type="submit" class="btn btn-lg btn-primary">
                  Consultar farmacias
                </button>
                <button
                  type="reset"
                  class="btn btn-lg btn-light w-50 mx-2"
                  @click="cleanDataForm"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div
        class="row mt-4 d-flex justify-content-center"
        v-if="pharmacies.length > 0"
      >
        <div class="col-sm-12 text-center">
          <div class="card">
            <div class="card-header">
              <h3>Lista de Farmacias de la R.M.</h3>
            </div>
            <div class="card-body">
              <table
                class="table table-striped table-bordered table-hovered table-responsive"
              >
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Telefono</th>
                    <th>Latitud</th>
                    <th>Longitud</th>
                    <th>Ubicación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="pharmacy in pharmacies" :key="pharmacy.direccion">
                    <td>
                      {{ pharmacy.local_nombre }}
                    </td>
                    <td>
                      {{ pharmacy.local_direccion }}
                    </td>
                    <td>
                      {{ pharmacy.local_telefono }}
                    </td>
                    <td>
                      {{ pharmacy.local_lat }}
                    </td>
                    <td>
                      {{ pharmacy.local_lng }}
                    </td>
                    <td>
                      <a
                        :href="
                          getUrlGoogleMap(
                            pharmacy.local_lat,
                            pharmacy.local_lng
                          )
                        "
                        target="_blank"
                        >Ver en Google Map</a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Services
import CommuneService from './api/communes.services';
import PharmaciesService from './api/pharmacies.services';

// Third Library
import Swal from 'sweetalert2';

export default {
  name: 'App',
  data() {
    return {
      communes: '',
      pharmacies: [],
      communesOptions: '',
      formPharmacy: {
        communeName: '',
        localName: ''
      }
    };
  },
  async mounted() {
    CommuneService.getCommunes('7').then(responseCommune => {
      this.communes = responseCommune.data;
      var doc = new DOMParser().parseFromString(this.communes, 'text/html');
      this.communesOptions = doc.body.children;
      var select = document.getElementById('inputCommune');
      select.append(...this.communesOptions);
    });
  },
  methods: {
    onSubmit() {
      // Esto se hace cuando queda la opcion por defecto seleccionada
      // y que el servicio responsa solo en base al local
      if (this.formPharmacy.communeName == 'Elija Comuna') {
        this.formPharmacy.communeName = undefined;
      }
      PharmaciesService.getPharmaciesByCommuneAndLocal(this.formPharmacy).then(
        responsePharmacies => {
          if (responsePharmacies.data.statusCode == 400) {
            Swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: responsePharmacies.data.message
            });
          } else if (responsePharmacies.data.length == 0) {
            Swal.fire({
              icon: 'warning',
              title: 'Lo sentimos',
              text: 'No existen farmacias con tales filtros seleccionados'
            });
          } else {
            this.pharmacies = responsePharmacies.data;
          }
        }
      );
    },
    getOptionValue(event) {
      const selectedCommune = [...event.target].filter(
        element => element.value == event.target.value
      );
      this.formPharmacy.communeName = selectedCommune[0].textContent;
    },
    cleanDataForm() {
      this.formPharmacy.communeName = '';
      this.formPharmacy.localName = '';
      this.pharmacies = [];
    },
    getUrlGoogleMap(lat, long) {
      return `${'https://www.google.com/maps/?'}q=${lat},${long}`;
    }
  }
};
</script>

<style lang="scss">
@import './assets/sass/app';
</style>
