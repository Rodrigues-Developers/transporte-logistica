import { Component } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Logistic } from "src/app/core/interfaces/logistic.interface";
import { LogisticService } from "src/app/core/services/logistic.service";

@Component({
  selector: "app-delivered",
  templateUrl: "./delivered.component.html",
  styleUrls: ["./delivered.component.less"]
})
export class DeliveredComponent {
  deliveredLogistics: Logistic[] = [];
  updateTable: boolean = false;

  constructor(private logisticService: LogisticService) {}

  onLogisticsSelected(logistics: Logistic[]): void {
    this.deliveredLogistics = logistics;
  }

  async returnNFE() {
    const updatePromises: Promise<any>[] = [];

    for (const logis of this.deliveredLogistics) {
      if (logis._id) {
        try {
          const updatedLogistic: Logistic = logis;
          logis.status = "";
          // Subscribe to the Observable returned by updateLogistic and push the promise into the array
          updatePromises.push(firstValueFrom(this.logisticService.updateLogistic(updatedLogistic)));
        } catch (error) {
          console.error(`Error updating logistics ${logis._id}: ${error}`);
        }
      }
    }

    try {
      // Wait for all update promises to resolve
      await Promise.all(updatePromises);

      // After all updates are done, invoke refreshTransportTable()
      this.refreshTransportTable();
    } catch (error) {
      console.error(`Error updating logistics: ${error}`);
    }
  }
  refreshTransportTable(): void {
    this.updateTable = !this.updateTable;
  }
}
