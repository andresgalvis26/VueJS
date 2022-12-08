<template>
  <v-app>
    <v-card>


      <!-- | TOOLBAR O NAVBAR | -->
      <v-app-bar color="blue darken-2" dark dense>
        <v-app-bar-nav-icon @click="stateDrawer = !stateDrawer"></v-app-bar-nav-icon>
        <v-toolbar-title>TO-DO LIST - VueJS & Vuetify</v-toolbar-title>
        <v-spacer></v-spacer>


        <!-- | TABS: GENERAL, PENDIENTES, EN PROCESO Y FINALIZADAS | -->
        <template v-slot:extension>
          <v-tabs v-model="tab" align-with-title fixed-tabs>
            <v-tabs-slider color="white"></v-tabs-slider>

            <v-tab v-for="item, index in items" :class="{ active: currentTab === index }" @click="currentTab = index"
              :key="item">
              {{ item }}
            </v-tab>
          </v-tabs>
        </template>
      </v-app-bar>


      <!-- | INFORMACIÓN QUE SE MUESTRA A LA IZQ. EN EL NAVBAR AL INTERACTUAR | -->
      <v-navigation-drawer app v-model="stateDrawer" temporary dark>
        <v-row class="mt-4" column>
          <v-col align="center" cols="12">
            <v-avatar>
              <img src="https://randomuser.me/api/portraits/men/52.jpg" alt="">
            </v-avatar>
            <h2 class="white--text">Admin</h2>
            <h4 class="white--text">25/10/2022</h4>
          </v-col>
        </v-row>

        <!-- | SI DESEO AÑADIR BOTONES + LINKS | -->
        <!-- <v-row column class="mx-2">
          <v-col>
            <v-btn color="green" block class="my-2" :to="{ name: 'Home' }">To-Do List</v-btn>
          </v-col>
        </v-row> -->
      </v-navigation-drawer>


      <!-- | V-TABS: CONTENIDO DIFERENTE POR TAB | -->
      <v-tabs-items v-model="tab">
        <v-card>

          <!-- | TAB GENERAL |-->
          <div v-if="currentTab === 0">
            <v-card>
              <v-card-title>
                <v-row>
                  <!-- | SEARCH | -->
                  <v-col cols="12" sm="6" md="9">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
                    </v-text-field>
                  </v-col>

                  <!-- | DIALOG Y FORM PARA NUEVA TAREA - GENERAL | -->
                  <v-col cols="12" sm="6" md="3" v-if="verDialog">
                    <v-dialog v-model="dialogAgregar" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn block elevation="5" color="blue darken-2" class="white--text mt-3" v-bind="attrs"
                          v-on="on">
                          Añadir tarea
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
                                  <v-select :items="['Alta', 'Media', 'Baja']" label="Prioridad de la tarea*" required
                                    v-model="prioridad"></v-select>
                                </v-col>

                                <v-col cols="12" sm="6">
                                  <v-select
                                    :items="['Alejandro', 'Andrés', 'Daniel', 'Felipe', 'Juan', 'Libardo', 'Nicolás']"
                                    label="Responsable de la tarea*" required v-model="responsable"></v-select>
                                </v-col>

                                <v-col cols="12">
                                  <v-select :items="['Pendientes', 'En proceso', 'Finalizadas']"
                                    label="Estado de la tarea*" required v-model="estado"></v-select>
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

                  <!-- | DIALOG Y FORM PARA EDITAR TAREA - GENERAL | -->
                  <v-col cols="3" v-if="!verDialog">
                    <v-dialog v-model="dialogEditar" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn block elevation="5" color="yellow" class="white--text mt-3" v-bind="attrs" v-on="on">
                          Editando tarea
                        </v-btn>
                      </template>

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
                                  <v-select :items="['Alta', 'Media', 'Baja']" label="Prioridad de la tarea*" required
                                    v-model="prioridad"></v-select>
                                </v-col>

                                <v-col cols="12" sm="6">
                                  <v-select
                                    :items="['Alejandro', 'Andrés', 'Daniel', 'Felipe', 'Juan', 'Libardo', 'Nicolás']"
                                    label="Responsable de la tarea*" required v-model="responsable"></v-select>
                                </v-col>

                                <v-col cols="12">
                                  <v-select :items="['Pendientes', 'En proceso', 'Finalizadas']"
                                    label="Estado de la tarea*" required v-model="estado"></v-select>
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


              <!-- | DATA TABLE | -->
              <v-data-table :headers="headers" :items="tareas" :search="search">

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
                        <!-- | BTN EDITAR | -->
                        <v-btn text icon @click="editar(index, item)">
                          <v-icon color="warning">mdi-pencil</v-icon>
                        </v-btn>

                        <!-- | BTN ELIMINAR | -->
                        <v-btn text icon @click="eliminarTarea(item.id)">
                          <v-icon color="error">mdi-trash-can</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </v-data-table>


              <!-- | SNACKBAR | -->
              <v-snackbar v-model="snackbar">
                {{ mensaje }}
                <template v-slot:action="{ attrs }">
                  <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                    Cerrar
                  </v-btn>
                </template>
              </v-snackbar>
            </v-card>
          </div>


          <!-- | TAB PENDIENTES |  -->
          <div v-if="currentTab === 1">
            <v-card>
              <v-card-title>
                <v-row>
                  <!-- | SEARCH | -->
                  <v-col cols="12" sm="6" md="9">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
                    </v-text-field>
                  </v-col>

                  <!-- | DIALOG Y FORM PARA NUEVA TAREA - PENDIENTES | -->
                  <v-col cols="12" sm="6" md="3" v-if="verDialog">
                    <v-dialog v-model="dialogAgregar" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn block elevation="5" color="blue darken-2" class="white--text mt-3" v-bind="attrs"
                          v-on="on">
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
                                  <v-select :items="['Alta', 'Media', 'Baja']" label="Prioridad de la tarea*" required
                                    v-model="prioridad"></v-select>
                                </v-col>

                                <v-col cols="12" sm="6">
                                  <v-select
                                    :items="['Alejandro', 'Andrés', 'Daniel', 'Felipe', 'Juan', 'Libardo', 'Nicolás']"
                                    label="Responsable de la tarea*" required v-model="responsable"></v-select>
                                </v-col>

                                <v-col cols="12">
                                  <v-select :items="['Pendientes', 'En proceso', 'Finalizadas']"
                                    label="Estado de la tarea*" required v-model="estado"></v-select>
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

                  <!-- | DIALOG Y FORM PARA EDITAR TAREA - PENDIENTES | -->
                  <v-col cols="3" v-if="!verDialog">
                    <v-dialog v-model="dialogEditar" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn block elevation="5" color="yellow" class="white--text mt-3" v-bind="attrs" v-on="on">
                          Editando tarea
                        </v-btn>
                      </template>

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
                                  <v-select :items="['Alta', 'Media', 'Baja']" label="Prioridad de la tarea*" required
                                    v-model="prioridad"></v-select>
                                </v-col>

                                <v-col cols="12" sm="6">
                                  <v-select
                                    :items="['Alejandro', 'Andrés', 'Daniel', 'Felipe', 'Juan', 'Libardo', 'Nicolás']"
                                    label="Responsable de la tarea*" required v-model="responsable"></v-select>
                                </v-col>

                                <v-col cols="12">
                                  <v-select :items="['Pendientes', 'En proceso', 'Finalizadas']"
                                    label="Estado de la tarea*" required v-model="estado"></v-select>
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
                            <v-btn color="blue darken-2" text @click="editarTarea()" type="submit">
                              Actualizar
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-form>
                    </v-dialog>
                  </v-col>
                </v-row>
              </v-card-title>


              <!-- | DATA TABLE | -->
              <v-data-table :headers="headers" :items="tareasPendientes" :search="search">

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
                        <!-- | BTN EDITAR - PENDIENTES | -->
                        <v-btn text icon @click="editar(index, item)">
                          <v-icon color="warning">mdi-pencil</v-icon>
                        </v-btn>

                        <!-- | BTN EDITAR - PENDIENTES | -->
                        <v-btn text icon @click="eliminarTarea(item.id)">
                          <v-icon color="error">mdi-trash-can</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </v-data-table>


              <!-- | SNACKBAR | -->
              <v-snackbar v-model="snackbar">
                {{ mensaje }}
                <template v-slot:action="{ attrs }">
                  <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                    Cerrar
                  </v-btn>
                </template>
              </v-snackbar>
            </v-card>
          </div>


          <!-- | TAB EN PROCESO |  -->
          <div v-if="currentTab === 2">
            <v-card>
              <v-card-title>
                <v-row>
                  <!-- | SEARCH | -->
                  <v-col cols="12" sm="6" md="9">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
                    </v-text-field>
                  </v-col>

                  <!-- | DIALOG Y FORM PARA EDITAR TAREA - EN PROCESO | -->
                  <v-col cols="12" sm="6" md="3" v-if="verDialog">
                    <v-dialog v-model="dialogAgregar" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn block elevation="5" color="blue darken-2" class="white--text mt-3" v-bind="attrs"
                          v-on="on">
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
                                  <v-select :items="['Alta', 'Media', 'Baja']" label="Prioridad de la tarea*" required
                                    v-model="prioridad"></v-select>
                                </v-col>

                                <v-col cols="12" sm="6">
                                  <v-select
                                    :items="['Alejandro', 'Andrés', 'Daniel', 'Felipe', 'Juan', 'Libardo', 'Nicolás']"
                                    label="Responsable de la tarea*" required v-model="responsable"></v-select>
                                </v-col>

                                <v-col cols="12">
                                  <v-select :items="['Pendientes', 'En proceso', 'Finalizadas']"
                                    label="Estado de la tarea*" required v-model="estado"></v-select>
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

                  <v-col cols="3" v-if="!verDialog">
                    <v-dialog v-model="dialogEditar" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn block elevation="5" color="yellow" class="white--text mt-3" v-bind="attrs" v-on="on">
                          Editando tarea
                        </v-btn>
                      </template>

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
                                  <v-select :items="['Alta', 'Media', 'Baja']" label="Prioridad de la tarea*" required
                                    v-model="prioridad"></v-select>
                                </v-col>

                                <v-col cols="12" sm="6">
                                  <v-select
                                    :items="['Alejandro', 'Andrés', 'Daniel', 'Felipe', 'Juan', 'Libardo', 'Nicolás']"
                                    label="Responsable de la tarea*" required v-model="responsable"></v-select>
                                </v-col>

                                <v-col cols="12">
                                  <v-select :items="['Pendientes', 'En proceso', 'Finalizadas']"
                                    label="Estado de la tarea*" required v-model="estado"></v-select>
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


              <!-- | DATA TABLE | -->
              <v-data-table :headers="headers" :items="tareasEnProceso" :search="search">

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
                        <!-- | BTN EDITAR - EN PROCESO | -->
                        <v-btn text icon @click="editar(index, item)">
                          <v-icon color="warning">mdi-pencil</v-icon>
                        </v-btn>

                        <!-- | BTN ELIMINAR - EN PROCESO | -->
                        <v-btn text icon @click="eliminarTarea(item.id)">
                          <v-icon color="error">mdi-trash-can</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </v-data-table>


              <!-- | SNACKBAR | -->
              <v-snackbar v-model="snackbar">
                {{ mensaje }}
                <template v-slot:action="{ attrs }">
                  <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                    Cerrar
                  </v-btn>
                </template>
              </v-snackbar>
            </v-card>
          </div>


          <!-- | TAB FINALIZADAS |  -->
          <div v-if="currentTab === 3">
            <v-card>
              <v-card-title>
                <v-row>
                  <!-- | SEARCH | -->
                  <v-col cols="12" sm="6" md="9">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar..." single-line hide-details>
                    </v-text-field>
                  </v-col>

                  <!-- | DIALOG Y FORM PARA EDITAR TAREA - FINALIZADAS | -->
                  <v-col cols="12" sm="6" md="3" v-if="verDialog">
                    <v-dialog v-model="dialogAgregar" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn block elevation="5" color="blue darken-2" class="white--text mt-3" v-bind="attrs"
                          v-on="on">
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
                                  <v-select :items="['Alta', 'Media', 'Baja']" label="Prioridad de la tarea*" required
                                    v-model="prioridad"></v-select>
                                </v-col>

                                <v-col cols="12" sm="6">
                                  <v-select
                                    :items="['Alejandro', 'Andrés', 'Daniel', 'Felipe', 'Juan', 'Libardo', 'Nicolás']"
                                    label="Responsable de la tarea*" required v-model="responsable"></v-select>
                                </v-col>

                                <v-col cols="12">
                                  <v-select :items="['Pendientes', 'En proceso', 'Finalizadas']"
                                    label="Estado de la tarea*" required v-model="estado"></v-select>
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

                  <v-col cols="3" v-if="!verDialog">
                    <v-dialog v-model="dialogEditar" persistent max-width="600px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn block elevation="5" color="yellow" class="white--text mt-3" v-bind="attrs" v-on="on">
                          Editando tarea
                        </v-btn>
                      </template>

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
                                  <v-select :items="['Alta', 'Media', 'Baja']" label="Prioridad de la tarea*" required
                                    v-model="prioridad"></v-select>
                                </v-col>

                                <v-col cols="12" sm="6">
                                  <v-select
                                    :items="['Alejandro', 'Andrés', 'Daniel', 'Felipe', 'Juan', 'Libardo', 'Nicolás']"
                                    label="Responsable de la tarea*" required v-model="responsable"></v-select>
                                </v-col>

                                <v-col cols="12">
                                  <v-select :items="['Pendientes', 'En proceso', 'Finalizadas']"
                                    label="Estado de la tarea*" required v-model="estado"></v-select>
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


              <!-- | DATA TABLE | -->
              <v-data-table :headers="headers" :items="tareasFinalizadas" :search="search">

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
                        <!-- | BTN EDITAR - FINALIZADAS | -->
                        <v-btn text icon @click="editar(index, item)">
                          <v-icon color="warning">mdi-pencil</v-icon>
                        </v-btn>

                        <!-- | BTN ELIMINAR - FINALIZADAS | -->
                        <v-btn text icon @click="eliminarTarea(item.id)">
                          <v-icon color="error">mdi-trash-can</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </v-data-table>


              <!-- | SNACKBAR | -->
              <v-snackbar v-model="snackbar">
                {{ mensaje }}
                <template v-slot:action="{ attrs }">
                  <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                    Cerrar
                  </v-btn>
                </template>
              </v-snackbar>
            </v-card>
          </div>

        </v-card>
      </v-tabs-items>
    </v-card>

    <!-- | ENRUTADO O RUTAS | -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import DataTable from '../views/DataTable.vue';
export default {
  name: "App",
  data: () => ({
    items: ["General", "Pendientes", "En proceso", "Finalizadas",],
    currentTab: 0,
    tab: null,
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
    stateDrawer: false,
    tareas: [
      // {id: 1, tituloTarea: 'Tarea #1', descripcionTarea: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', prioridadTarea: 'Alta', responsableTarea: 'Andrés', estadoTarea: 'Pendientes' },
      // {id: 2, tituloTarea: 'Tarea #2', descripcionTarea: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', prioridadTarea: 'Baja', responsableTarea: 'Nicolás', estadoTarea: 'Finalizadas' },
      // {id: 3, tituloTarea: 'Tarea #3', descripcionTarea: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', prioridadTarea: 'Media', responsableTarea: 'Daniel', estadoTarea: 'En proceso' },
    ],
  }),
  methods: {
    agregarNuevaTarea() {
      if (this.titulo === '' || this.prioridad === '' || this.responsable === '' || this.estado === '') {
        this.snackbar = true
        this.mensaje = 'Por favor llena todos los campos requeridos.'
      } else {
        this.tareas.push({
          id: Date.now(),
          tituloTarea: this.titulo,
          descripcionTarea: this.descripcion,
          prioridadTarea: this.prioridad,
          responsableTarea: this.responsable,
          estadoTarea: this.estado
        })

        localStorage.setItem("tareas", JSON.stringify(this.tareas));

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
      this.tareas = this.tareas.filter(e => e.id != id)
      // Retornará el nuevo arreglo con todas las tareas que tengan un ID distinto al que se pasó. Eliminando el registro con el ID envíado.

      localStorage.setItem("tareas", JSON.stringify(this.tareas));
    },
    editar(index, item) {
      this.verDialog = false
      this.dialogEditar = true

      this.tareas.map(tarea => {
        if (tarea.id === item.id) {
          this.idTarea = tarea.id;
          this.titulo = tarea.tituloTarea;
          this.descripcion = tarea.descripcionTarea;
          this.prioridad = tarea.prioridadTarea;
          this.responsable = tarea.responsableTarea;
          this.estado = tarea.estadoTarea;
        }
      })

      // CON INDEX //
      // this.titulo = this.tareas[index].tituloTarea;
      // this.descripcion = this.tareas[index].descripcionTarea;
      // this.prioridad = this.tareas[index].prioridadTarea;
      // this.responsable = this.tareas[index].responsableTarea;
      // this.estado = this.tareas[index].estadoTarea;
    },
    editarTarea() {
      this.tareas.map(tarea => {
        if (tarea.id === this.idTarea) {
          // console.log(tarea);
          tarea.tituloTarea = this.titulo;
          tarea.descripcionTarea = this.descripcion;
          tarea.prioridadTarea = this.prioridad;
          tarea.responsableTarea = this.responsable;
          tarea.estadoTarea = this.estado;
        }
      })
      this.snackbar = true
      this.mensaje = 'Se ha actualizado la tarea con éxito.'

      // CON INDEX //
      // this.tareas[this.idTarea].tituloTarea = this.titulo;
      // this.tareas[this.idTarea].descripcionTarea = this.descripcion;
      // this.tareas[this.idTarea].prioridadTarea = this.prioridad;
      // this.tareas[this.idTarea].responsableTarea = this.responsable;
      // this.tareas[this.idTarea].estadoTarea = this.estado;

      localStorage.setItem("tareas", JSON.stringify(this.tareas));

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
  components: { DataTable },
  created() {
    let data = localStorage.getItem("tareas");
    if (data != null) {
      this.tareas = JSON.parse(data);
    }
  },
  computed: {
    tareasPendientes: function () {
      return this.tareas.filter(tarea => tarea.estadoTarea === 'Pendientes');
    },
    tareasEnProceso() {
      return this.tareas.filter(tarea => tarea.estadoTarea === 'En proceso');
    },
    tareasFinalizadas() {
      return this.tareas.filter(tarea => tarea.estadoTarea === 'Finalizadas');
    },
  },
};
</script>
