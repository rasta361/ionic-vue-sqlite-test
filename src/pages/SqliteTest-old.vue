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
import { defineComponent, Ref, ref } from "vue";
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
import { useSQLite } from "vue-sqlite-hook/dist";
// import { Capacitor } from "@capacitor/core";

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
    const {
      requestPermissions,
      openDB,
      close,
      execute,
      run,
      query,
    } = useSQLite();

    const output: Ref<Array<string>> = ref(["output placeholder"]);
    const input: Ref<string> = ref("");

    async function save() {
      console.log("saving... " + input.value);

      // open db
      let result: any = await openDB("test-sqlite");
      if (!result.result) {
        console.error("Could not open DB");
        return;
      }

      // create table
      result = await execute(`
        BEGIN TRANSACTION;
        CREATE TABLE IF NOT EXISTS testtable (
          id INTEGER PRIMARY KEY NOT NULL,
          test TEXT
        );
        COMMIT TRANSACTION
      `);
      console.log(result.message);

      // insert test
      result = await run("INSERT INTO testtable (test) VALUES (?)", [
        input.value,
      ]);
      console.log("result ", result.changes.changes, result.changes.lastId);
    }

    async function load() {
      console.log("loading");
      const result: any = query("SELECT * FROM testtable");
      console.log("result ", result.values.length);
      output.value = result.values;
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