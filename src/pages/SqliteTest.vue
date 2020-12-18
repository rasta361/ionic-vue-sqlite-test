<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Test</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form @submit.prevent="">
        <ion-list>
          <ion-item>
            <ion-text>
              <p>{{ output }}</p>
            </ion-text>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Input</ion-label>
            <ion-input type="text" v-model="input"></ion-input>
          </ion-item>
          <ion-button type="button" expand="block" @click="save"
            >Save</ion-button
          >
          <ion-button type="button" expand="block" @click="load"
            >Load</ion-button
          >
        </ion-list>
      </form>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonContent,
} from "@ionic/vue";
import { Plugins } from "@capacitor/core";
import "@capacitor-community/sqlite";
import { JsonSQLite } from "@capacitor-community/sqlite";
import { BehaviorSubject } from "rxjs";
import db from "../assests/db.json";
const { CapacitorSQLite, Device, Storage } = Plugins;

const DB_SETUP_KEY = "first_db_setup";
const DB_NAME_KEY = "db_name";

export default defineComponent({
  name: "SqliteTest",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonContent,
  },
  setup() {
    const dbReady = new BehaviorSubject(false);
    let dbName: any = "";

    // TODO: weiter im tutorial bei Minute 13
    // https://www.youtube.com/watch?v=2kTT3k8ztL8

    // probably renaming function
    async function downloadDatabase(update = false) {
      const jsonstring = JSON.stringify(db);
      const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

      if (isValid.result) {
        const dbName = db.database;
        await Storage.set({ key: DB_NAME_KEY, value: dbName });
        await CapacitorSQLite.importFromJson({ jsonstring });
        await Storage.set({ key: DB_SETUP_KEY, value: "1" });
      }

      if (!update) {
        await CapacitorSQLite.createSyncTable();
      } else {
        await CapacitorSQLite.setSyncDate({
          syncdate: "" + new Date().getTime(),
        });
      }

      dbReady.next(true);
    }

    async function setupDatabase() {
      const dbSetupDone = await Storage.get({ key: DB_SETUP_KEY });

      if (!dbSetupDone.value) {
        downloadDatabase();
      } else {
        dbName = (await Storage.get({ key: DB_NAME_KEY })).value;
        await CapacitorSQLite.open({ database: dbName });
        dbReady.next(true);
      }
    }

    onMounted(async () => {
      const info = await Device.getInfo();

      if (info.platform === "android") {
        try {
          const sqlite = CapacitorSQLite as any;
          await sqlite.requestPermissions();
          setupDatabase();
        } catch (e) {
          console.error("No DB access");
        }
      } else {
        setupDatabase();
      }
    });

    const output: Ref<Array<string>> = ref(["output placeholder"]);
    const input: Ref<string> = ref("");

    async function save() {
      console.log("saving... " + input.value);
    }

    async function load() {
      console.log("loading");
    }

    return {
      output,
      input,
      save,
      load,
    };
  },
});
</script>