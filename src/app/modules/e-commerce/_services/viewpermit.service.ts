import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
 import { TableService,TableResponseModel, ITableState, BaseModel, PaginatorState, SortState, GroupingState } from 'src/app/_metronic/shared/crud-table';
import { baseFilter } from 'src/app/_fake/fake-helpers/http-extenstions';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ViewPermit } from '../_models/viewpermit.model';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

@Injectable({
  providedIn: 'root'
})
export class ViewPermitService extends TableService<ViewPermit> implements OnDestroy {
  
    LOTNO=  localStorage.getItem('currentlotno');
 
  API_URL = `${environment.apiUrl}/customerviewpermit?lot_no=`;
 
   constructor(@Inject(HttpClient) http) {
    super(http);
  }


  // READ
  find(tableState: ITableState): Observable<TableResponseModel<ViewPermit>> {
    return this.http.get<ViewPermit[]>(this.API_URL+this.LOTNO).pipe(
      map((response: ViewPermit[]) => {
        
        const filteredResult = baseFilter(response, tableState);
        const result: TableResponseModel<ViewPermit> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }
  deleteItems(ids: number[] = []): Observable<any> {
    const tasks$ = [];
    ids.forEach(id => {
      tasks$.push(this.delete(id));
    });
    return forkJoin(tasks$);
  }

  updateStatusForItems(ids: number[], status: number): Observable<any> {
    return this.http.get<ViewPermit[]>(this.API_URL).pipe(
      map((viewpermit: ViewPermit[]) => {
        return viewpermit.filter(c => ids.indexOf(c.id) > -1).map(c => {
          //c.status = status;
          return c;
        });
      }),
      exhaustMap((viewpermit: ViewPermit[]) => {
        const tasks$ = [];
        viewpermit.forEach(viewpermit => {
          tasks$.push(this.update(viewpermit));
        });
        return forkJoin(tasks$);
      })
    );
  }
 





  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
