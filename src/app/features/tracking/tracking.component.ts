import { Logistic } from "src/app/core/interfaces/logistic.interface";
import { Component, OnInit } from "@angular/core";
import { LogisticService } from "src/app/core/services/logistic.service";
import { PopupStateService } from "src/app/core/services/popup-state.service";

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.component.html",
  styleUrls: ["./tracking.component.less"]
})
export class TrackingComponent implements OnInit {
  isPopUpVisible: boolean = false;
  receivedLogistics: Logistic[] = [];
  updateTable: boolean = false;

  constructor(private logisticService: LogisticService, private popupStateService: PopupStateService) {}

  ngOnInit(): void {}

  onLogisticsSelected(logistics: Logistic[]): void {
    this.receivedLogistics = logistics;
  }

  async receive() {
    for (const logis of this.receivedLogistics) {
      if (logis._id) {
        try {
          const updatedLogistic: Logistic = logis;
          logis.status = "Entregue";
          this.logisticService.updateLogistic(updatedLogistic).subscribe(() => this.refreshTransportTable());
        } catch (error) {
          console.error(`Error updating logistics ${logis._id}: ${error}`);
        }
      }
    }
  }

  togglePopup(isVisible?: boolean) {
    this.isPopUpVisible = isVisible !== undefined ? isVisible : !this.isPopUpVisible;
    this.popupStateService.setDataLogistic(this.isPopUpVisible);
  }

  sendNF(isPopupConfirmed: boolean) {
    if (isPopupConfirmed) {
      this.receive();
    }
    this.togglePopup();
  }

  refreshTransportTable(): void {
    this.updateTable = !this.updateTable;
  }
}
