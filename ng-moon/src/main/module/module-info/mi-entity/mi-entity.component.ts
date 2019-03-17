import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import { FormComponent } from 'src/share/components/form/form.component';
import { OverlayRef } from '@angular/cdk/overlay';
import { ModalService } from 'src/share/components/modal/modal.service';
import { FormOption, Row, InputControl, AddItemControl, SelectControl, CheckboxControl } from 'src/share/components/form/form.type';
import { Subject, Observable } from 'rxjs';
import { ColumnTypeData } from './mi-entity.store';
import { Select } from 'src/share/components/select/select.type';
import { SettingService } from 'src/services/setting.service';
import { ModuleInfoService } from '../module-info.service';

@Component({
    selector: 'nm-mi-entity',
    styleUrls: ['./mi-entity.component.scss'],
    templateUrl: './mi-entity.component.html'
})
export class MiEntityComponent implements OnInit {

    data = [
        { id: '1', label: '编号', key: 'id', type: 'varchar', length: 36, primary: true },
        { id: '2', label: '账号', key: 'account', type: 'varchar', length: 32 },
        { id: '3', label: '密码', key: 'password', type: 'varchar', length: 64 },
        { id: '4', label: '姓名', key: 'name', type: 'varchar', length: 64 },
        { id: '5', label: '邮箱', key: 'email', type: 'varchar', length: 64 },
        { id: '6', label: '手机号', key: 'phone', type: 'char', length: 11 },
        { id: '7', label: '角色', key: 'roles' },
        { id: '8', label: '组织机构', key: 'organizations' }

    ]

    @ViewChild('entityTemp') entityTemp: TemplateRef<any>;

    entityForm: FormComponent;
    @ViewChild("entityForm") set _formCom(val) {
        this.entityForm = val;
    }

    modal: OverlayRef;

    submitSubject = new Subject();

    getData = Observable.create(x => {
        x.next({
            id: this.settingService.guid(),
            moduleId: this.moduleInfoService.id,
            columns: [
                { id: this.settingService.guid(), label: '名称' }
            ]
        })
    });

    formOption: FormOption = {
        title: '页面信息',
        controls: [
            new Row({
                hide: true, controls: [
                    new InputControl({ key: "id", label: "编号" }),
                    new InputControl({ key: "moduleId", label: "对应模块Id" }),
                ]
            }),
            new Row({
                controls: [
                    new InputControl({ key: "name", label: "名称", col: 3 }),
                    new InputControl({ key: "code", label: "编码", col: 3 }),
                    new InputControl({ key: "description", label: "描述", col: 6 }),
                ]
            }),
            new Row({
                title: '属性', icon: 'icon-grid', controls: [
                    new AddItemControl({
                        key: "columns",
                        type: 'batch',
                        buttons: [
                            // {
                            //     label: '分组排序', handler: this.groupSetSubject
                            // }
                        ],
                        form: {
                            controls: [
                                new Row({
                                    hide: true, controls: [
                                        new InputControl({ key: "id", label: "编号" }),
                                        new InputControl({ key: "entityId", label: "编号", relation: 'many-one' }),
                                    ]
                                }),
                                new Row({
                                    title: "基本信息",
                                    icon: "icon-align-justify",
                                    controls: [
                                        new InputControl({ key: "label", label: "名称", colHead: true, col: 6, required: true }),
                                        new InputControl({ key: "name", label: "编码", colHead: true, col: 6, required: true }),
                                        new SelectControl({
                                            key: 'type', label: '类型', data: ColumnTypeData as Select[], col: 6, colHead: true
                                        }),
                                        new InputControl({ key: "length", label: "长度", colHead: true, col: 6 }),
                                        new CheckboxControl({ key: "primary", label: "主键", width: 50, colHead: true, col: 3 }),
                                        new CheckboxControl({ key: "nullable", label: "允许空", width: 50, colHead: true, col: 3 }),
                                        new CheckboxControl({ key: "unique", label: "唯一", width: 50, colHead: true, col: 3 }),
                                        new InputControl({ key: "default", label: "默认值", colHead: true, col: 6 }),
                                    ]
                                })
                            ]
                        }
                    }),
                ]
            })
        ],
        buttons: [
            { type: 'submit', handler: this.submitSubject }
        ],
        data: this.getData
    }

    constructor(
        private modalService: ModalService,
        private settingService: SettingService,
        private moduleInfoService: ModuleInfoService
    ) { }

    ngOnInit() {

    }

    action(type: string) {
        switch (type) {
            case 'add':
                this.modal = this.modalService.create({
                    panelClass: 'form',
                    templateRef: this.entityTemp,
                    title: '新建实体',
                    width: 800,
                    height: 600
                })
                break;
        }
    }
}
