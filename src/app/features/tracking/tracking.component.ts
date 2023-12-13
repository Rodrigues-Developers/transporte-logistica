import { Logistic } from "src/app/core/interfaces/logistic.interface";
import { Component, OnInit } from "@angular/core";
import { LogisticService } from "src/app/core/services/logistic.service";

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.component.html",
  styleUrls: ["./tracking.component.less"]
})
export class TrackingComponent implements OnInit {
  receivedLogistics: Logistic[] = [];
  updateTable: boolean = false;

  constructor(private logisticService: LogisticService) {}

  ngOnInit(): void {}

  onLogisticsSelected(logistics: Logistic[]): void {
    this.receivedLogistics = logistics;
  }

  async receive() {
    for (const logis of this.receivedLogistics) {
      if (logis._id) {
        try {
          const updatedLogistic: Logistic = logis;
          logis.status = "delivered";
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
