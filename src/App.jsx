import { useState } from "react";
import "./App.css";

const ServiceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CharistristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

function App() {
  const [state, setState] = useState("");
  const [ppg, setPpg] = useState();
  const [ecg, setEcg] = useState();
  const [force, setForce] = useState();

  async function onButtonClick() {
    navigator.bluetooth
      .requestDevice({
        optionalServices: [ServiceUUID],
        filters: [{ namePrefix: "ECG-PPG-Server" }],
      })
      .then((device) => {
        device.gatt.connect().then((gatt) => {
          gatt.getPrimaryService(ServiceUUID).then((service) => {
            service.getCharacteristic(CharistristicUUID).then((charastirctic) => {
              charastirctic.oncharacteristicvaluechanged = (data) => {
                setPpg(data.srcElement.value.getUint16(0, true))
                setEcg(data.srcElement.value.getUint16(2, true))
                setForce(data.srcElement.value.getUint16(4, true))
              }
              charastirctic.startNotifications()
            })
          });
        });
      });
  }
  return (
    <>
      {state && <p>{state} connected!</p>}
      {ppg && <p>{ppg} ppg!</p>}
      {ecg && <p>{ecg} ecg!</p>}
      {force && <p>{force} force!</p>}
      <button onClick={onButtonClick}>connect</button>
    </>
  );
}

export default App;