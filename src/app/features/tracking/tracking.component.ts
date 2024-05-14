import { Logistic } from "src/app/core/interfaces/logistic.interface";
import { Component, OnInit } from "@angular/core";
import { LogisticService } from "src/app/core/services/logistic.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.component.html",
  styleUrls: ["./tracking.component.less"]
})
export class TrackingComponent implements OnInit {
  isPopUpVisible: boolean = false;
  receivedLogistics: Logistic[] = [];
  updateTable: boolean = false;

  constructor(private logisticService: LogisticService) {}

  ngOnInit(): void {}

  onLogisticsSelected(logistics: Logistic[]): void {
    this.receivedLogistics = logistics;
  }

  async receive() {
    const updatePromises: Promise<any>[] = [];

    for (const logis of this.receivedLogistics) {
      if (logis._id) {
        try {
          const updatedLogistic: Logistic = logis;
          logis.status = "Entregue";
          // Subscribe to the Observable returned by updateLogistic and push the promise into the array
          updatePromises.push(firstValueFrom(this.logisticService.updateLogistic(updatedLogistic)));
        } catch (error) {
          console.error(`Error updating logistics ${logis._id}: ${error}`);
        }
      }
    }
    this.togglePopup();

    try {
      // Wait for all update promises to resolve
      await Promise.all(updatePromises);

      // After all updates are done, invoke refreshTransportTable()
      this.refreshTransportTable();
    } catch (error) {
      console.error(`Error updating logistics: ${error}`);
    }
  }

  togglePopup(isVisible?: boolean) {
    this.isPopUpVisible = isVisible !== undefined ? isVisible : !this.isPopUpVisible;
  }

  sendNF(isPopupConfirmed: boolean) {
    if (isPopupConfirmed) {
      this.receive();
    } else this.togglePopup();
  }

  refreshTransportTable(): void {
    this.updateTable = !this.updateTable;
  }
}
