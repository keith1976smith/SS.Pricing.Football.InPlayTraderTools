// This contains all the data tinkering, transformation and molestation that the old UI ASP server did prior to giving to the UI
import _ from "lodash";

export default function(fixtures){
	
	_.forEach(fixtures, (fixture)=> {

		if (fixture.EventStateResponse.TraderExtraTimeSetup){
			
			fixture.EventStateResponse.TraderExtraTimeSetup.Display = "None";	

			if (fixture.EventStateResponse.TraderExtraTimeSetup.Condition === 0){ //Exact score
				fixture.EventStateResponse.TraderExtraTimeSetup.Display = 
					fixture.EventStateResponse.TraderExtraTimeSetup.HomeExtraTime + "-" + 
					fixture.EventStateResponse.TraderExtraTimeSetup.AwayExtraTime;	
			}

			if (fixture.EventStateResponse.TraderExtraTimeSetup.Condition === 1){ //Home win
				fixture.EventStateResponse.TraderExtraTimeSetup.Display = "Home by " + 
					fixture.EventStateResponse.TraderExtraTimeSetup.HomeExtraTime;	
			}

			if (fixture.EventStateResponse.TraderExtraTimeSetup.Condition === 2){ //Away win
				fixture.EventStateResponse.TraderExtraTimeSetup.Display = "Away by " + 
					fixture.EventStateResponse.TraderExtraTimeSetup.AwayExtraTime;	
			}

			if (fixture.EventStateResponse.TraderExtraTimeSetup.Condition === 3){ //Draw
				fixture.EventStateResponse.TraderExtraTimeSetup.Display = "Any Draw";	
			} 
		}

		if (fixture.EventStateResponse.TraderPenaltiesSetup){
			
			fixture.EventStateResponse.TraderPenaltiesSetup.Display = "None";	

			if (fixture.EventStateResponse.TraderPenaltiesSetup.Condition === 0){ //Draw no goals in extra time
				fixture.EventStateResponse.TraderPenaltiesSetup.Display = "Exactly 0-0 In ExtraTime";
			}

			if (fixture.EventStateResponse.TraderPenaltiesSetup.Condition === 1){ //Draw in extra time
				fixture.EventStateResponse.TraderPenaltiesSetup.Display = "Any Draw in ExtraTime";	
			}

			if (fixture.EventStateResponse.TraderPenaltiesSetup.Condition === 2){ //Exact score
				fixture.EventStateResponse.TraderPenaltiesSetup.Display = 
					fixture.EventStateResponse.TraderPenaltiesSetup.HomePenalties + "-" + 
					fixture.EventStateResponse.TraderPenaltiesSetup.AwayPenalties;	
			}

			if (fixture.EventStateResponse.TraderPenaltiesSetup.Condition === 3){ //Home win
				fixture.EventStateResponse.TraderPenaltiesSetup.Display = "Home by " + 
					fixture.EventStateResponse.TraderPenaltiesSetup.HomePenalties;	
			}

			if (fixture.EventStateResponse.TraderPenaltiesSetup.Condition === 4){ //Away win
				fixture.EventStateResponse.TraderPenaltiesSetup.Display = "Away by " + 
					fixture.EventStateResponse.TraderPenaltiesSetup.AwayPenalties;	
			}

			if (fixture.EventStateResponse.TraderPenaltiesSetup.Condition === 5){ //Draw
				fixture.EventStateResponse.TraderPenaltiesSetup.Display = "Any Draw";	
			} 
		}

	});

	return fixtures;
}