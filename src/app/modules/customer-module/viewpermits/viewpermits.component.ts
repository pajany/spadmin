import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { async } from '@rxweb/reactive-form-validators';
import { Subscription } from 'rxjs';
import { GroupingState, ITableState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { EditCourtesycardModalComponent } from '../../e-commerce/courtesy-card/components/edit-courtesycard-modal/edit-courtesycard-modal.component';
import { CourtesyCardService } from '../../e-commerce/_services/courtesycard.service';
import { ViewPermitService } from '../../e-commerce/_services';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

@Component({
  selector: 'app-viewpermits',
  templateUrl: './viewpermits.component.html',
  styleUrls: ['./viewpermits.component.scss']
})
export class ViewpermitsComponent implements OnInit {

  
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  totalrec: any;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private modalService: NgbModal,
    public viewpermitService: ViewPermitService) { }

  ngOnInit(): void {
    this.viewpermitService.fetch();
    this.totalrec = this.viewpermitService.fetch();
    this.grouping = this.viewpermitService.grouping;
    this.paginator = this.viewpermitService.paginator;
    this.sorting = this.viewpermitService.sorting;
    const sb = this.viewpermitService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    console.log("RESssss",this.viewpermitService);
  }
  

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.viewpermitService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.viewpermitService.patchState({ paginator });
  }
}
