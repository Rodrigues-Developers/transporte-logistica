import { Component } from "@angular/core";
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
    for (const logis of this.deliveredLogistics) {
      if (logis._id) {
        try {
          const updatedLogistic: Logistic = logis;
          logis.status = "in data";
          this.logisticService.updateLogistic(updatedLogistic).subscribe(() => this.refreshTransportTable());
        } catch (error) {
          console.error(`Error updating logistics ${logis._id}: ${error}`);
        }
      }
    }
  }
  refreshTransportTable(): void {
    this.updateTable = !this.updateTable;
  }
}
