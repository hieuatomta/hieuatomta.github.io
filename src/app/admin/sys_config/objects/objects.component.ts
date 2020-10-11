import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {ObjectUpdateComponent} from './object-update/object-update.component';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmDialogComponent} from '../../../shares/directives/confirm-dialog/confirm-dialog.component';
import {MapPopupComponent} from './map-popup/map.popup.component';
import {ObjectsService} from '../../../@core/services/objects.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ngx-roles',
  styleUrls: ['./objects.component.scss'],
  templateUrl: './objects.component.html',
})
export class ObjectsComponent implements OnInit {
  dataParent;
  paramSearch = {
    id: null,
    code: null,
    name: null,
    description: null,
    status: null,
    tanentId: null,
    updateTime: null,
    parentId: null,
  };
  listStatus = [
    {name: 'common.status.1', code: 1},
    {name: 'common.status.0', code: 0}
  ]
  columns = [
    {name: 'common.table.item_number', prop: 'index', flexGrow: 0.3, isTree: false},
    {name: 'common.table.item_objects_code', prop: 'code', flexGrow: 2, isTree: true},
    {name: 'common.table.item_objects_name', prop: 'name', flexGrow: 1.4, isTree: false},
    {name: 'common.table.item_update_time', prop: 'updateTime', flexGrow: 1, isTree: false},
    {name: 'common.table.item_status', prop: 'status', flexGrow: 1, isTree: false},
    {name: 'common.table.item_url', prop: 'pathUrl', flexGrow: 1, isTree: false},
    {name: 'common.table.item_objects_popup', prop: 'map_action', flexGrow: 0.6, isTree: false},
    {name: 'common.table.item_action', prop: 'action_btn', flexGrow: 0.8, isTree: false}
  ];
  rows;

  search() {
    this.objectsService.doSearch(this.paramSearch)
      .subscribe(res => this.rows = this.formatData(res.body, 0) || [] );
  }

  ngOnInit(): void {
    this.search();
    this.getParent();
  }

  formatData(data, parentId) {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].parentId === parentId) {
        const children = this.formatData(data, data[i].id);
        if (children.length === 0) {
          data[i].treeStatus = "disabled";
        }
        arr = arr.concat(children);
        arr.push(data[i]);
      }
    }
    return arr;
  }

  getParent() {
    this.objectsService.getParent().subscribe(data => this.dataParent = data.body);
  }

  constructor(private objectsService: ObjectsService,
              private dialogService: NbDialogService,
              private toastr: NbToastrService,
              private translate: TranslateService) {
  }

  open(data) {
    let title;
    if (data == null) {
      title = this.translate.instant('objects.title_add');
    } else {
      title = this.translate.instant('objects.title_edit');
    }
    this.dialogService.open(ObjectUpdateComponent, {
      context: {
        title: title,
        data: data,
      },
      dialogClass: 'modal-full',
      hasScroll: true,
    }).onClose.subscribe(
      value => {
        if (value) {
          if (data == null) {
            this.toastr.success(this.translate.instant('objects.content_add_success'),
              this.translate.instant('objects.title_notification'));
          } else {
            this.toastr.success(this.translate.instant('objects.content_edit_success'),
              this.translate.instant('objects.title_notification'));
          }
          this.search();
          this.getParent();
        }
      },
    );
  }

  delete(data) {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        message: this.translate.instant('module.message_delete') + ' ' + data.name,
      }
    }).onClose.subscribe(res => {
      if (res) {
        this.objectsService.delete(data).subscribe(
          () => {
            this.toastr.success(this.translate.instant('module.delete_success'),
              this.translate.instant('user.title_notification'));
            this.search();
          },
          (error) => {
            if (error.error?.title) {
              this.toastr.danger(error.error.title,
                this.translate.instant('user.title_notification'));
            } else {
              this.toastr.danger(this.translate.instant('module.unknown_error'),
                this.translate.instant('user.title_notification'));
            }
          }
        )
        this.getParent();
      }
    })
  }

  onTreeAction(event: any) {
    const row = event.row;
    if (row.treeStatus === 'expanded') {
      row.treeStatus = 'collapsed';
    } else {
      row.treeStatus = 'expanded';
    }
    this.rows = [...this.rows];
  }

  openMapModule(data) {
    const openMap = this.dialogService.open(MapPopupComponent, {
      context: {
        title: this.translate.instant('module.title_map_module'),
        data: data,
      }
    })
    openMap.onClose.subscribe(value => {
      if (value) {
        this.toastr.success(this.translate.instant('module.content_map_action_success'),
          this.translate.instant('user.title_notification'));
      }
    })
  }
}
