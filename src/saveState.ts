console.log("Updating... Check if sync is needed...");

const syncFrequencyInMinutes = 0.1;
const lastSync = data.value.lastSync ?? 0;

if (lastSync + syncFrequencyInMinutes * 1000 * 60 <= Date.now()) {
  console.log("Starting Sync to LocalStorage...");

  nextTick(() => {
    write("state", data.value);

    const newSyncTimestamp = Date.now();

    console.log(`Sync finished. New lastSync value: ${newSyncTimestamp}`);

    data.value.lastSync = newSyncTimestamp;
  });
}
