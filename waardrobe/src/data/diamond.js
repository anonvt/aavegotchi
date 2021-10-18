// https://raw.githubusercontent.com/aavegotchi/aavegotchi-contracts/master/diamondABI/diamond.json
import diamondAbi from "./diamondAbi.json";

import Web3 from "web3";

let contract = null;

const initContract = function () {
    const diamondAddress = "0x86935F11C86623deC8a25696E1C19a8659CbF95d";
    const web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(
        diamondAbi,
        diamondAddress
    );
};

const diamond = {
    getAavegotchi (gotchiId) {
        return new Promise((resolve, reject) => {
            contract.methods.getAavegotchi(gotchiId).call((error, result) => {
                if (error) {
                    console.error("getAavegotchi: Error calling contract function", error);
                    reject(error);
                    return;
                }
                console.log("getAavegotchi: Result", result);
                resolve(result);
            });
        });
    },

    getAavegotchiSideSvgs (gotchiId) {
        return new Promise((resolve, reject) => {
            contract.methods.getAavegotchiSideSvgs(gotchiId).call((error, result) => {
                if (error) {
                    console.error("getAavegotchiSideSvgs: Error calling contract function", error);
                    reject(error);
                    return;
                }
                //console.log("getAavegotchiSideSvgs: Result", result);
                resolve(result);
            });
        });
    },

    getPreviewAavegotchiSideSvgs (hauntId, collateralType, numericTraits, equippedWearables) {
        return new Promise((resolve, reject) => {
            contract.methods.previewSideAavegotchi(hauntId, collateralType, numericTraits, equippedWearables).call((error, result) => {
                if (error) {
                    console.error("getPreviewAavegotchiSideSvgs: Error calling contract function", error);
                    reject(error);
                    return;
                }
                //console.log("getPreviewAavegotchiSideSvgs: Result", result);
                resolve(result);
            });
        });
    },

    // call manually to get the latest wearables.json
    getItemTypes () {
        contract.methods.getItemTypes([]).call((error, result) => {
            if (error) {
                console.error("getItemTypes: Error calling contract function", error);
                return;
            }
            console.log("getItemTypes: Result", result);
            const itemTypes = result.filter(item => item.category === "0").map(item => ({
                id: item.svgId,
                name: item.name,
                dimensions: item.dimensions,
                slotPositions: item.slotPositions,
                rarityScoreModifier: item.rarityScoreModifier,
                traitModifiers: item.traitModifiers
            }));
            console.log(JSON.stringify(itemTypes));
        });
    }


    // baseRarityScore(numericTraits) (array of 6)
    // modifiedTraitsAndRarityScore(gotchiId) <-- look at implementation in facet
    // equipped wearable sets seem to only be in the subgraph, need to reimplement
};

export default function useDiamond () {
    if (!contract) {
        initContract();
    }
    return diamond;
}