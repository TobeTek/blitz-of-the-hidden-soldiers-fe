import * as snarkjs from "snarkjs";

async function snarkJsPlonkProof(params: {
  proofData: any;
  wasm: any;
  zkey: any;
}) {
  const result = await snarkjs.plonk.fullProve(
    params.proofData,
    params.wasm,
    params.zkey
  );
  self.postMessage(result);
}

onmessage = function (e: MessageEvent) {
  const data = e.data;
  snarkJsPlonkProof(data);
};
