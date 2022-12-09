<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-9">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <!-- VueJS + Vuetify + Quasar -->
            <div class="text-h6">Calculadora - VueJS + Vuetify + Quasar</div> 
          </q-card-section>
          <q-card-section>
            <div class="text-h5 text-grey-5 text-right">
              {{ acumulador + actual }}
            </div>
            <div class="text-h3 text-right">
              {{ resultado }}
            </div>
          </q-card-section>
          <q-card-section class="bg-grey-4">
            <div class="row q-col-gutter-sm">
              <div 
                class="col-3"
                v-for="(btn, index) in botones" :key="index"
              >
                <q-btn 
                  class="full-width text-h6"
                  :color="noEsNumero(btn) ? 'indigo' : 'grey-2'"
                  :text-color="noEsNumero(btn) ? 'white' : 'grey-8'"
                  @click="btnAccion(btn)"
                >
                  {{ btn }}
                </q-btn>
              </div>
              <div class="col-6">
                <q-btn 
                  class="full-width text-h6" 
                  color="indigo"
                  @click="btnReiniciar()"
                >
                  Reset
                </q-btn>
              </div>
              <div class="col-6">
                <q-btn 
                  class="full-width text-h6" 
                  color="orange"
                  @click="btnResultado()"
                >
                  =
                </q-btn>
              </div>
            </div>

          </q-card-section>
        </q-card>
        <pre>
          {{ arrayResultados }}
        </pre>
      </div>

    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { defineComponent } from 'vue';
import { evaluate, round } from 'mathjs'

export default defineComponent({
  name: 'PageIndex',

  setup() {

    // | Declaración
    const botones = [7, 8, 9, "%", 4, 5, 6, "+", 1, 2, 3, "-", ".", 0, "/", "*"];
    const noEsNumero = valor => isNaN(valor)
    const actual = ref('')
    const acumulador = ref('')
    const resultado = ref('')
    const operadorClick = ref(true) // Se deja en true para evitar que aparezca el operador al principio (Se podría el menos)
    const arrayResultados = ref([])

    const agregamosOperador = valor => {
      if(!operadorClick.value){
        acumulador.value += `${actual.value} ${valor} `
        actual.value = ""
        operadorClick.value = true;
      }
    }

    const btnReiniciar = () => {
      actual.value = ""
      acumulador.value = ""
      resultado.value = ""
    }

    const btnResultado = () => {
      if(!operadorClick.value) {
        resultado.value = evaluate(acumulador.value + actual.value)
        arrayResultados.value.push(`${acumulador.value}${actual.value} = ${resultado.value}`)
      } else {
        resultado.value = 'ERROR!'
      }
    }

    const ejecutarOperacion = valor => {
      if (valor === ".") {
        if(actual.value.indexOf('.') === -1){
          actual.value = `${actual.value}${valor}`
        }

        return 
      }

      if (valor === "%") {
        if(actual.value !== ''){
          actual.value = `${parseFloat(actual.value) / 100}`
        }
        
        return
      }

      agregamosOperador(valor)
    }

    const btnAccion = valor => {

      if(!noEsNumero(valor)) {
        if(operadorClick.value) {
          actual.value = "" // Reiniciamos el valor (sería un operador)
          operadorClick.value = false // Cambiamos el estado
        }
        // En la primera vuelta NO tiene nada, después que presione por primera vez lo guarda y le va concatenando el siguiente número que se presione.
        actual.value = `${actual.value}${valor}` 
      } else {
        ejecutarOperacion(valor)
      }



    }

    return {
      botones,
      noEsNumero,
      btnAccion,
      actual,
      acumulador,
      btnReiniciar,
      btnResultado,
      resultado,
      arrayResultados
    }
  }
}
)
</script>
<style>
.text-h5 {
  height: 25px;
}
.text-h3 {
  height: 50px;
}
</style>
