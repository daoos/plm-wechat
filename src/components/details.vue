<template>
  <div class="details">
    <div v-if="detailType === 'doc' || detailType === 'chgNotifyDetails' || detailType === 'chgApplyBookDetails'">
      <header>{{detailInfo.docName}}</header>
      <ul>
        <li><span class="texttitle">文档编码:</span> {{detailInfo.docNum}}</li>
        <li><span class="texttitle">文档版本:</span> {{detailInfo.docVer}}</li>
        <li><span class="texttitle">类型:</span> {{detailInfo.docType}}</li>
        <li><span class="texttitle">分类:</span> {{detailInfo.docClassify}}</li>
        <li><span class="texttitle">创建人:</span> {{detailInfo.createPerson}}</li>
        <li><span class="texttitle">状态:</span> {{detailInfo.docStatus}}</li>
        <li><span class="texttitle">摘要:</span> {{detailInfo.docAbstract}}</li>
        <li><span class="texttitle">关键字:</span> {{detailInfo.docKeyWord}}</li>
        <li><span class="texttitle">创建时间:</span> {{detailInfo.createTime}}</li>
        <li><span class="texttitle">修改时间:</span> {{detailInfo.changeTime}}</li>
        <li><span class="texttitle">文档格式:</span> {{detailInfo.docFormat}}</li>
        <li><span class="texttitle">文档密级:</span> {{detailInfo.docDense}}</li>
        <li><span class="texttitle">生效时间:</span> {{detailInfo.validTime}}</li>
        <li><span class="texttitle">失效时间:</span> {{detailInfo.invalidTime}}</li>
        <li><span class="texttitle">修改人:</span> {{detailInfo.changePerson}}</li>
        <li><span class="texttitle">备注:</span> {{detailInfo.remarks}}</li>
        <li><span class="texttitle">关联的任务:</span> </li>
        <div v-if="detailInfo.relatedTasks.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>项目编码</th>
                <th>项目名称</th>
                <th>任务名称</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedTasks">
                <td>{{item.belongProjectNum}}</td>
                <td>{{item.belongProjectName}}</td>
                <td>{{item.taskName}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <li><span class="texttitle">关联的物料:</span> </li>
        <div v-if="detailInfo.relatedMaterails.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>物料编码</th>
                <th>物料名称</th>
                <th>物料版本</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedMaterails">
                <td>{{item.materailNum}}</td>
                <td>{{item.materailName}}</td>
                <td>{{item.materailVer}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
      </ul>
    </div>
    <div v-if="detailType === 'matter'">
      <header>{{detailInfo.materialName}}</header>
      <ul>
        <li><span class="texttitle">物料编码:</span> {{detailInfo.materialNum}}</li>
        <li><span class="texttitle">物料版本:</span> {{detailInfo.materialVer}}</li>
        <li><span class="texttitle">物料分类:</span> {{detailInfo.materialClassify}}</li>
        <li><span class="texttitle">材料:</span> {{detailInfo.materialStuff}}</li>
        <li><span class="texttitle">物料备注:</span> {{detailInfo.materialRemarks}}</li>
        <li><span class="texttitle">重量:</span> {{detailInfo.weight}}</li>
        <li><span class="texttitle">摘要:</span> {{detailInfo.docAbstract}}</li>
        <li><span class="texttitle">状态:</span> {{detailInfo.status}}</li>
        <li><span class="texttitle">创建人:</span> {{detailInfo.createPerson}}</li>
        <li><span class="texttitle">修改人:</span> {{detailInfo.changePerson}}</li>
        <li><span class="texttitle">修改时间:</span> {{detailInfo.changeTime}}</li>
        <li><span class="texttitle">种类:</span> {{detailInfo.materailClass}}</li>
        <li><span class="texttitle">属性:</span> {{detailInfo.propety}}</li>
        <li><span class="texttitle">物料导入ERP状态:</span> {{detailInfo.importErpStatus}}</li>
        <li><span class="texttitle">原件号:</span> {{detailInfo.originalNum}}</li>
        <li><span class="texttitle">规格:</span> {{detailInfo.standard}}</li>
        <li><span class="texttitle">计量单位:</span> {{detailInfo.measurementUnit}}</li>
        <li><span class="texttitle">计量单位组:</span> {{detailInfo.measurementUnitGroup}}</li>
        <li><span class="texttitle">型号:</span> {{detailInfo.model}}</li>
        <li><span class="texttitle">产品类型:</span> {{detailInfo.productClass}}</li>
        <li><span class="texttitle">关联的文档:</span> </li>
        <div v-if="detailInfo.relatedDocs.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>文档编码</th>
                <th>文档名称</th>
                <th>文档版本</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedDocs">
                <td>{{item.docNum}}</td>
                <td>{{item.docName}}</td>
                <td>{{item.docVer}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
      </ul>
    </div>
    <div v-if="detailType === 'apply'">
      <header>{{detailInfo.chgApplyName}}</header>
      <ul>
        <li><span class="texttitle">编码:</span> {{detailInfo.chgApplyNum}}</li>
        <li><span class="texttitle">状态:</span> {{detailInfo.status}}</li>
        <li><span class="texttitle">创建人:</span> {{detailInfo.createPerson}}</li>
        <li><span class="texttitle">创建时间:</span> {{detailInfo.createTime}}</li>
        <li><span class="texttitle">文档变更:</span></li>
        <div v-if="detailInfo.relatedDocs.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>文档编码</th>
                <th>文档名称</th>
                <th>文档版本</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedDocs">
                <td>{{item.docNum}}</td>
                <td>{{item.docName}}</td>
                <td>{{item.docVer}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <li><span class="texttitle">设计BOM变更:</span> </li>
        <div v-if="detailInfo.relatedDesignBom.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>物料编码</th>
                <th>物料名称</th>
                <th>物料版本</th>
                <th>所属BOM</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedDesignBom">
                <td>{{item.partid}}</td>
                <td>{{item.partname}}</td>
                <td>{{item.partver}}</td>
                <td>{{item.bomname}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <li><span class="texttitle">工艺BOM变更:</span> </li>
        <div v-if="detailInfo.relatedTechnicsBom.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>物料编码</th>
                <th>物料名称</th>
                <th>物料版本</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedTechnicsBom">
                <td>{{item.partid}}</td>
                <td>{{item.partname}}</td>
                <td>{{item.partver}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <li><span class="texttitle">工序变更:</span> </li>
        <div v-if="detailInfo.relatedTechnicsProcess.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>工序编码</th>
                <th>工序名称</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedTechnicsProcess">
                <td>{{item.techprcid}}</td>
                <td>{{item.techprcver}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
      </ul>
    </div>
    <div v-if="detailType === 'task'">
      <header>{{detailInfo.chgTaskName}}</header>
      <ul>
        <li><span class="texttitle">执行人:</span> {{detailInfo.executePerson}}</li>
        <li><span class="texttitle">创建人:</span> {{detailInfo.createPerson}}</li>
        <li><span class="texttitle">创建时间:</span> {{detailInfo.createTime}}</li>
        <li><span class="texttitle">计划开始时间:</span> {{detailInfo.planStartTime}}</li>
        <li><span class="texttitle">计划结束时间:</span> {{detailInfo.planEndTime}}</li>
        <li><span class="texttitle">状态:</span> {{detailInfo.status}}</li>
        <li><span class="texttitle">实际开始时间:</span> {{detailInfo.realStartTime}}</li>
        <li><span class="texttitle">实际结束时间:</span> {{detailInfo.realEndTime}}</li>
        <li><span class="texttitle">文档变更:</span></li>
        <div v-if="detailInfo.relatedDocs.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>文档编码</th>
                <th>文档名称</th>
                <th>文档版本</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedDocs">
                <td>{{item.docNum}}</td>
                <td>{{item.docName}}</td>
                <td>{{item.docVer}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <li><span class="texttitle">设计BOM变更:</span> </li>
        <div v-if="detailInfo.relatedDesignBom.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>物料编码</th>
                <th>物料名称</th>
                <th>物料版本</th>
                <th>所属BOM</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedDesignBom">
                <td>{{item.partid}}</td>
                <td>{{item.partname}}</td>
                <td>{{item.partver}}</td>
                <td>{{item.bomname}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <li><span class="texttitle">工艺BOM变更:</span> </li>
        <div v-if="detailInfo.relatedTechnicsBom.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>物料编码</th>
                <th>物料名称</th>
                <th>物料版本</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedTechnicsBom">
                <td>{{item.partid}}</td>
                <td>{{item.partname}}</td>
                <td>{{item.partver}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <li><span class="texttitle">工序变更:</span> </li>
        <div v-if="detailInfo.relatedTechnicsProcess.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>工序编码</th>
                <th>工序名称</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedTechnicsProcess">
                <td>{{item.techprcid}}</td>
                <td>{{item.techprcver}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
      </ul>
    </div>
    <div v-if="detailType === 'PROJECT_TASK'">
      <header>任务详情</header>
      <ul>
        <li><span class="texttitle">任务名称:</span> {{detailInfo.taskName}}</li>
        <li><span class="texttitle">任务状态:</span> {{detailInfo.taskType}}</li>
        <li><span class="texttitle">所属项目:</span> {{detailInfo.belongProject}}</li>
        <li><span class="texttitle">所属产品:</span> {{detailInfo.belongProduct}}</li>
        <li><span class="texttitle">创建人:</span> {{detailInfo.createPerson}}</li>
        <li><span class="texttitle">执行人:</span> {{detailInfo.executePerson}}</li>
        <li><span class="texttitle">计划开始时间:</span> {{detailInfo.planStartTime}}</li>
        <li><span class="texttitle">计划结束时间:</span> {{detailInfo.planEndTime}}</li>
        <li><span class="texttitle">最早开始时间:</span> {{detailInfo.earliestStartTime}}</li>
        <li><span class="texttitle">最晚结束时间:</span> {{detailInfo.latestEndTime}}</li>
        <li><span class="texttitle">实际开始时间:</span> {{detailInfo.realStartTime}}</li>
        <li><span class="texttitle">实际结束时间:</span> {{detailInfo.realEndTime}}</li>
        <li><span class="texttitle">预警百分比:</span> {{detailInfo.warnPercent}}</li>
        <li><span class="texttitle">预警时间:</span> {{detailInfo.warnTime}}</li>
      </ul>
    </div>
    <div v-if="detailType === 'CHANGE_LISTENER'">
      <header>任务详情</header>
      <ul>
        <li><span class="texttitle">变更通知名称:</span> {{detailInfo.docname}}</li>
        <li><span class="texttitle">变更通知编码:</span> {{detailInfo.docid}}</li>
        <li><span class="texttitle">变更通知版本:</span> {{detailInfo.docver}}</li>
        <li><span class="texttitle">下发时间:</span> {{detailInfo.receivetime}}</li>
        <li><span class="texttitle">文档变更:</span></li>
        <div v-if="detailInfo.relateddoc.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>文档编码</th>
                <th>文档名称</th>
                <th>文档版本</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relateddoc">
                <td>{{item.docid}}</td>
                <td>{{item.docname}}</td>
                <td>{{item.docver}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <li><span class="texttitle">设计BOM变更:</span> </li>
        <div v-if="detailInfo.relatedbom.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>物料编码</th>
                <th>物料名称</th>
                <th>物料版本</th>
                <th>所属BOM</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedbom">
                <td>{{item.partid}}</td>
                <td>{{item.partname}}</td>
                <td>{{item.partver}}</td>
                <td>{{item.bomname}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <li><span class="texttitle">工艺BOM变更:</span> </li>
        <div v-if="detailInfo.relatedtechbom.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>物料编码</th>
                <th>物料名称</th>
                <th>物料版本</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedtechbom">
                <td>{{item.partid}}</td>
                <td>{{item.partname}}</td>
                <td>{{item.partver}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
        <li><span class="texttitle">工序变更:</span> </li>
        <div v-if="detailInfo.relatedtechprc.length>0" class="detailXTable" style="padding:0 15px;">
          <x-table full-bordered style="background-color:#fff;">
            <thead>
              <tr style="background-color: #F7F7F7">
                <th>工序编码</th>
                <th>工序名称</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailInfo.relatedtechprc">
                <td>{{item.techprcid}}</td>
                <td>{{item.techprcver}}</td>
              </tr>
            </tbody>
          </x-table>
        </div>
      </ul>
    </div>
    <div v-if="detailType === 'FAFANG_NOTICE'">
      <header>任务详情</header>
      <ul>
        <li><span class="texttitle">文档名称:</span> {{detailInfo.docname}}</li>
        <li><span class="texttitle">文档编码:</span> {{detailInfo.docid}}</li>
        <li><span class="texttitle">文档版本:</span> {{detailInfo.docver}}</li>
        <li><span class="texttitle">下发时间:</span> {{detailInfo.receivetime}}</li>
        <li><span class="texttitle">有效期:</span> {{detailInfo.vaildtime}} - {{detailInfo.trashtime}}</li>
        <li><span class="texttitle">下发权限:</span> {{detailInfo.authority}}</li>
      </ul>
    </div>
    <div v-if="detailType === 'CHECK_DOC_TASK'">
      <header>任务详情</header>
      <ul>
        <li><span class="texttitle">审签节点名称:</span> {{detailInfo.shenqianNoteName}}</li>
        <li><span class="texttitle">文档版本:</span> {{detailInfo.docVer}}</li>
        <li><span class="texttitle">文档编码:</span> {{detailInfo.docNum}}</li>
        <li><span class="texttitle">文档名称:</span> {{detailInfo.docName}}</li>
        <li><span class="texttitle">文档格式:</span> {{detailInfo.docType}}</li>
        <li><span class="texttitle">文档分类:</span> {{detailInfo.docClassify}}</li>
        <li><span class="texttitle">提交人:</span> {{detailInfo.sumbitPerson}}</li>
        <li><span class="texttitle">文档提交时间:</span> {{detailInfo.sumbitTime}}</li>
        <li><span class="texttitle">状态:</span> {{detailInfo.status}}</li>
        <li><span class="texttitle">项目编码:</span> {{detailInfo.projectNum}}</li>
        <li><span class="texttitle">任务到达时间:</span> {{detailInfo.taskArriveTime}}</li>
        <li><span class="texttitle">任务所属人:</span> {{detailInfo.receivePerson}}</li>
        <li><span class="texttitle">任务类型:</span> {{detailInfo.taskType}}</li>
        <li><span class="texttitle">所属任务:</span> {{detailInfo.belongTask}}</li>
        <li><span class="texttitle">所属产品:</span> {{detailInfo.belongProduct}}</li>
        <li><span class="texttitle">所属项目:</span> {{detailInfo.belongProject}}</li>
        <li><span class="texttitle">流程名称:</span> {{detailInfo.belongProcedure}}</li>
        <li><span class="texttitle">流程图:</span> </li>
      </ul>
    </div>
    <div v-if="detailType === 'CHECK_BOM_TASK'">
      <header>任务详情</header>
      <ul>
        <li><span class="texttitle">流程名称:</span> {{detailInfo.procedureName}}</li>
        <li><span class="texttitle">审签节点名称:</span> {{detailInfo.shenqianNoteName}}</li>
        <li><span class="texttitle">任务到达时间:</span> {{detailInfo.projectArriveTime}}</li>
        <li><span class="texttitle">Bom类型:</span> {{detailInfo.bomType}}</li>
        <li><span class="texttitle">Bom名称:</span> {{detailInfo.bomName}}</li>
        <li><span class="texttitle">Bom版本:</span> {{detailInfo.bomVer}}</li>
        <li><span class="texttitle">项目编码:</span> {{detailInfo.projectNum}}</li>
        <li><span class="texttitle">物料编码:</span> {{detailInfo.materialNum}}</li>
        <li><span class="texttitle">物料版本:</span> {{detailInfo.materialVer}}</li>
        <li><span class="texttitle">物料名称:</span> {{detailInfo.materialName}}</li>
        <li><span class="texttitle">工艺版本:</span> {{detailInfo.technicVer}}</li>
        <li><span class="texttitle">提交人:</span> {{detailInfo.sumbitPerson}}</li>
        <li><span class="texttitle">状态:</span> {{detailInfo.status}}</li>
        <li><span class="texttitle">任务所属人:</span> {{detailInfo.projectBelongPerson}}</li>
        <li><span class="texttitle">任务类型:</span> {{detailInfo.taskType}}</li>
        <li><span class="texttitle">所属任务:</span> {{detailInfo.belongTask}}</li>
        <li><span class="texttitle">所属产品:</span> {{detailInfo.belongProduct}}</li>
        <li><span class="texttitle">所属项目:</span> {{detailInfo.belongProject}}</li>
        <li><span class="texttitle">流程图:</span> </li>
      </ul>
    </div>
    <div v-if="detailType === 'CHECK_CHGAPP_TASK'">
      <header>任务详情</header>
      <ul>
        <li><span class="texttitle">审签节点名称:</span> {{detailInfo.shenqianNoteName}}</li>
        <li><span class="texttitle">任务到达时间:</span> {{detailInfo.taskArriveTime}}</li>
        <li><span class="texttitle">变更申请单编号:</span> {{detailInfo.changeApplyNum}}</li>
        <li><span class="texttitle">提交人:</span> {{detailInfo.sumbitPerson}}</li>
        <li><span class="texttitle">状态:</span> {{detailInfo.status}}</li>
        <li><span class="texttitle">任务类型:</span> {{detailInfo.taskType}}</li>
        <li><span class="texttitle">变更申请单名称:</span> {{detailInfo.changeApplyName}}</li>
        <li><span class="texttitle">所属任务:</span> {{detailInfo.belongTask}}</li>
        <li><span class="texttitle">任务所属人:</span> {{detailInfo.taskBelongPerson}}</li>
        <li><span class="texttitle">流程名称:</span> {{detailInfo.belongProcedure}}</li>
        <li><span class="texttitle">流程图:</span> </li>
      </ul>
    </div>
    <div v-if="detailType === 'CHECK_CHG_TASK'">
      <header>任务详情</header>
      <ul>
        <li><span class="texttitle">审签节点名称:</span> {{detailInfo.shenqianNoteName}}</li>
        <li><span class="texttitle">任务到达时间:</span> {{detailInfo.projectArriveTime}}</li>
        <li><span class="texttitle">任务名称:</span> {{detailInfo.taskName}}</li>
        <li><span class="texttitle">提交人:</span> {{detailInfo.sumbitPerson}}</li>
        <li><span class="texttitle">提交时间:</span> {{detailInfo.sumbitTime}}</li>
        <li><span class="texttitle">状态:</span> {{detailInfo.status}}</li>
        <li><span class="texttitle">任务类型:</span> {{detailInfo.taskType}}</li>
        <li><span class="texttitle">项目编码:</span> {{detailInfo.projectNum}}</li>
        <li><span class="texttitle">所属任务:</span> {{detailInfo.belongTask}}</li>
        <li><span class="texttitle">任务所属人:</span> {{detailInfo.taskBelongPerson}}</li>
        <li><span class="texttitle">所属产品:</span> {{detailInfo.belongProduct}}</li>
        <li><span class="texttitle">所属项目:</span> {{detailInfo.belongProject}}</li>
        <li><span class="texttitle">流程名称:</span> {{detailInfo.belongProcedure}}</li>
        <li><span class="texttitle">流程图:</span> </li>
      </ul>
    </div>
  </div>
</template>

<script>
/*
 * @detailType
 * search-doc
 * search-matter
 * search-apply
 * search-task
 * taskList-PROJECT_TASK
 * taskList-CHECK_DOC_TASK 文档审签任务
 * taskList-CHECK_BOM_TASK BOM审签任务
 * taskList-CHECK_CHGAPP_TASK 变更申请审签任务
 * taskList-CHECK_CHG_TASK 变更审签任务
 * taskList-CHANGE_LISTENER
 * taskList-FAFANG_NOTICE
 */

import { XTable } from 'vux'

export default {
  name: 'Details',
  components: {
    XTable
  },
  props: {
    detailType: {
      type: String,
      required: true
    },
    detailInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
  .details {}
  .details li,
  .details header {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .details li {
    height: 40px;
    line-height: 40px;
    text-align: left;
    background: #e8e8e8;
    padding: 0 10px;
  }
  .details header {
    text-align: center;
    height: 50px;
    line-height: 50px;
    background: #aeb1af;
    font-size: 16px;
    color: white;
  }
  .details li:nth-of-type(2n+1) {
    background: #f3f3f3;
  }
  .details li .texttitle {
    width: 130px;
    display: inline-block;
    text-align: right;
    font-weight: bold;
  }
  .detailXTable {
    margin: 5px 0;
    font-size: 12px;
  }
</style>
