<template lang="">
    <v-card>
      <v-card-title>
        <v-row>
          <!-- | Botón Búsqueda | -->
          <v-col cols="12" sm="6" md="9">
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar..." single-line hide-details></v-text-field>
          </v-col>
  
          <!-- | Dialog + Form para añadir nueva tarea | -->
          <v-col cols="12" sm="6" md="3" v-if="verDialog">
            <v-dialog v-model="dialogAgregar" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn block elevation="5" color="blue darken-2" class="white--text mt-3" v-bind="attrs" v-on="on">
                  Añadir nueva tarea
                </v-btn>
              </template>
  
              <v-form @submit.prevent="agregarNuevaTarea()">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Añadir una nueva tarea</span>
                  </v-card-title>
  
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field label="Título de la tarea*" required v-model="titulo"></v-text-field>
                        </v-col>
      
                        <v-col cols="12">
                          <v-textarea label="Descripción" v-model="descripcion"></v-textarea>
                        </v-col>
      
                        <v-col cols="12" sm="6">
                          <v-select :items="['Alta', 'Media', 'Baja']" label="Prioridad de la tarea*" required v-model="prioridad"></v-select>
                        </v-col>
      
                        <v-col cols="12" sm="6">
                          <v-select :items="['Alejandro', 'Andrés', 'Daniel', 'Felipe', 'Juan', 'Libardo', 'Nicolás']" label="Responsable de la tarea*" required v-model="responsable"></v-select>
                        </v-col>
  
                        <v-col cols="12">
                          <v-select :items="['Pendientes', 'En proceso', 'Finalizadas']" label="Estado de la tarea*" required v-model="estado"></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                    <small>*Indica todos los campos requeridos</small>
                  </v-card-text>
  
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-2" text @click="cerrarFormAgregarTarea()">
                      Cerrar
                    </v-btn>
                    <v-btn color="blue darken-2" text type="submit">
                      Añadir
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </v-col>
  
          <!-- | Botón para editar una tarea | -->
          <v-col cols="3" v-if="!verDialog">
            <v-dialog v-model="dialogEditar" persistent max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn block   elevation="5" color="yellow" class="white--text mt-3" v-bind="attrs" v-on="on">
                  Editando tarea
                </v-btn>
              </template>
  
              <!-- | Formulario para editar una tarea existente | -->
              <v-form @submit.prevent="editarTarea()">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Editar una tarea existente</span>
                  </v-card-title>
  
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field label="Título de la tarea*" required v-model="titulo"></v-text-field>
                        </v-col>
      
                        <v-col cols="12">
                          <v-textarea label="Descripción" v-model="descripcion"></v-textarea>
                        </v-col>
      
                        <v-col cols="12" sm="6">
                          <v-select :items="['Alta', 'Media', 'Baja']" label="Prioridad de la tarea*" required v-model="prioridad"></v-select>
                        </v-col>
      
                        <v-col cols="12" sm="6">
                          <v-select :items="['Alejandro', 'Andrés', 'Daniel', 'Felipe', 'Juan', 'Libardo', 'Nicolás']" label="Responsable de la tarea*" required v-model="responsable"></v-select>
                        </v-col>
  
                        <v-col cols="12">
                          <v-select :items="['Pendientes', 'En proceso', 'Finalizadas']" label="Estado de la tarea*" required v-model="estado"></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                    <small>*Indica todos los campos requeridos</small>
                  </v-card-text>
  
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-2" text @click="cerrarFormEditarTarea()">
                      Cerrar
                    </v-btn>
                    <v-btn color="blue darken-2" text type="submit">
                      Actualizar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
          </v-col>
        </v-row>
      </v-card-title>
  
  
      <!-- | Data Table | -->
      <v-data-table :headers="headers" :items="desserts" :search="search" >
  
        <template v-slot:item.prioridadTarea="{ item }">
          <!-- Cambiar el color -->
          <v-chip :color="getColor(item.prioridadTarea)" dark>
            {{ item.prioridadTarea }}
          </v-chip>
        </template>
  
        <template v-slot:item.estadoTarea="{ item }">
          <v-chip :color="getEstado(item.estadoTarea)" dark>
            {{ item.estadoTarea }}
          </v-chip>
        </template>
  
        <!-- | Con v-slot selecciono una columna, en este caso, selecciono action y se convierte en item -->
        <!-- | Ahora puedo enviar el item.id y lo recibirá la función de eliminar o editar -->
        <template v-slot:item.acciones="{ item, index }">
          <div class="text-center">
            <v-row>
              <v-col>
                <!-- | Botón Editar | -->
                <v-btn text icon @click="editar(index)">
                  <v-icon color="warning">mdi-pencil</v-icon>
                </v-btn>
  
                <!-- | Botón Eliminar | -->
                <v-btn text icon @click="eliminarTarea(item.id)">
                  <v-icon color="error">mdi-trash-can</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </template>
      </v-data-table>
  
  
      <!-- | Snackbar - Mensaje de información | -->
      <v-snackbar v-model="snackbar">
        {{ mensaje }}
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
  
  
  
  
  
  
  
  
  
    </v-card>
  </template>
  
  <script>
  export default {
    props: ['desserts'],
    data() {
      return {
        search: '',
        id: '',
        titulo: '',
        descripcion: '',
        prioridad: '',
        responsable: '',
        estado: '',
        mensaje: 'Mensaje por default del snackbar.',
        snackbar: false,
        dialogAgregar: false,
        dialogEditar: false,
        verDialog: true,
        headers: [
          {
            text: 'Título de la Tarea',
            align: 'center',
            filterable: true,
            value: 'tituloTarea',
          },
          { text: 'Descripción', value: 'descripcionTarea', align: 'center' },
          { text: 'Prioridad', value: 'prioridadTarea', align: 'center' },
          { text: 'Responsable', value: 'responsableTarea', align: 'center' },
          { text: 'Estado', value: 'estadoTarea', align: 'center' },
          { text: 'Acciones', value: 'acciones', align: 'center' }
        ],
        // desserts: [
        //   {id: 1, tituloTarea: 'Tarea #1', descripcionTarea: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', prioridadTarea: 'Alta', responsableTarea: 'Andrés', estadoTarea: 'Pendientes' },
        //   {id: 2, tituloTarea: 'Tarea #2', descripcionTarea: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', prioridadTarea: 'Baja', responsableTarea: 'Nicolás', estadoTarea: 'Finalizadas' },
        //   {id: 3, tituloTarea: 'Tarea #3', descripcionTarea: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', prioridadTarea: 'Media', responsableTarea: 'Daniel', estadoTarea: 'En proceso' },
        // ],
      }
    },
    methods: {
      agregarNuevaTarea() {
        if (this.titulo === '' || this.prioridad === '' || this.responsable === '' || this.estado === '') {
          this.snackbar = true
          this.mensaje = 'Por favor llena todos los campos requeridos.'
        } else {
          this.desserts.push({
            id: Date.now(),
            tituloTarea: this.titulo,
            descripcionTarea: this.descripcion,
            prioridadTarea: this.prioridad,
            responsableTarea: this.responsable,
            estadoTarea: this.estado
          })
  
          // Almacenando en localStorage
          // localStorage.setItem("desserts", JSON.stringify(this.desserts));
  
          // Limpiando 
          this.titulo = ''
          this.descripcion = ''
          this.prioridad = ''
          this.responsable = ''
          this.estado = ''
          this.snackbar = true
          this.mensaje = 'Se ha añadido la tarea de forma exitosa.'
          this.dialogAgregar = false
  
  
  
        }
      },
      eliminarTarea(id) {
        // Se crea un nuevo arreglo de objetos 'desserts' filtrando y eliminando la tarea que envía su ID
        this.desserts = this.desserts.filter(e => e.id != id)
        // Retornará el nuevo arreglo con todas las tareas que tengan un ID distinto al que se pasó. Eliminando el registro con el ID envíado.
  
  
        // Actualizando en localStorage
        // localStorage.setItem("desserts", JSON.stringify(this.desserts));
      },
      editar(index) {
        this.verDialog = false
        this.dialogEditar = true
  
  
        this.titulo = this.desserts[index].tituloTarea;
        this.descripcion = this.desserts[index].descripcionTarea;
        this.prioridad = this.desserts[index].prioridadTarea;
        this.responsable = this.desserts[index].responsableTarea;
        this.estado = this.desserts[index].estadoTarea;
        this.indexTarea = index;
      },
      editarTarea() {
        this.desserts[this.indexTarea].tituloTarea = this.titulo;
        this.desserts[this.indexTarea].descripcionTarea = this.descripcion;
        this.desserts[this.indexTarea].prioridadTarea = this.prioridad;
        this.desserts[this.indexTarea].responsableTarea = this.responsable;
        this.desserts[this.indexTarea].estadoTarea = this.estado;
        this.snackbar = true
        this.mensaje = 'Se ha actualizado la tarea con éxito.'
  
        // Almacenando en localStorage
        // localStorage.setItem("desserts", JSON.stringify(this.desserts));
  
        this.titulo = ''
        this.descripcion = ''
        this.prioridad = ''
        this.responsable = ''
        this.estado = ''
        this.dialogAgregar = false
        this.verDialog = true
      },
      cerrarFormAgregarTarea() {
        this.dialogAgregar = false
        this.titulo = '',
          this.descripcion = '',
          this.prioridad = '',
          this.responsable = '',
          this.estado = ''
      },
      cerrarFormEditarTarea() {
        this.dialogEditar = false,
          this.verDialog = true,
          this.titulo = '',
          this.descripcion = '',
          this.prioridad = '',
          this.responsable = '',
          this.estado = ''
      },
      getColor(prioridad) {
        switch (prioridad) {
          case 'Alta':
            return 'light-blue darken-4';
          case 'Media':
            return 'light-blue accent-3';
          case 'Baja':
            return 'light-blue accent-1';
          default:
            console.log('No hay prioridad definidad. Lo siento.');
        }
      },
      getEstado(estado) {
        switch (estado) {
          case 'Finalizadas':
            return 'green darken-3'
          case 'En proceso':
            return 'yellow lighten-1'
          case 'Pendientes':
            return 'deep-orange darken-4'
        }
      },
    },
    // created() {
    //   let data = localStorage.getItem("desserts");
    //   if (data != null) {
    //     this.desserts = JSON.parse(data);
    //   }
    // },
    // computed: {
    //   tareasPendientes () {
    //     return this.desserts.filter(tarea => tarea.estadoTarea === 'Pendientes');
    //   },
    //   tareasEnProceso() {
    //     return this.desserts.filter(tarea => tarea.estadoTarea === 'En proceso');
    //   },
    //   tareasFinalizadas() {
    //     return this.desserts.filter(tarea => tarea.estadoTarea === 'Finalizadas');
    //   },
    // },
  }
  </script>
  
  <style lang="">
      
  </style>