/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.honestchain.SampleTransaction} sampleTransaction
 * @transaction
 */
async function sampleTransaction(tx) {
    // Save the old value of the asset.
    //const oldValue = tx.asset.value;

    // Update the asset with the new value.

    
    var avg  = (tx.tasklist.cs + tx.tasklist.dr)/2;
    var risk_level = "low";
    var decision = "approved";
    var base_reputation = 10;
    var reputation = 0;
    if (avg <= 3){
	    risk_level = "low";
	    decision = "approved";
      	    reputation = reputation + base_reputation + 1 ;
    }
    else if(avg >3 && avg <=7){
	    risk_level = "medium";
      	    decision = "manual approval required"
            reputation = reputation + base_reputation + 0 ;
    }
    else{
	    risk_level = "high";
      	    decision = "denied";
            reputation = reputation + base_reputation - 1 ;
    }
    tx.tasklist.decision = decision;
    tx.tasklist.risk_level = risk_level;
    tx.tasklist.reputation = reputation;
    tx.tasklist.cs = tx.newcs;
    tx.tasklist.dr = tx.newdr;
    tx.newDecision = tx.tasklist.decision;
    tx.new_risk_level = tx.tasklist.risk_level;
    tx.new_reputation = tx.tasklist.reputation;
    
    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.honestchain.TaskList');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.tasklist);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.honestchain', 'SampleEvent');
    event.tasklist = tx.tasklist;
    event.newCS = tx.newCS;
    event.newdr = tx.newdr;
    event.newDecision = tx.newDecision;
    event.new_risk_level = tx.new_risk_level;
    event.new_reputation = tx.new_reputation;
    
  	//event.newavg = tx.avg
    emit(event);
}



