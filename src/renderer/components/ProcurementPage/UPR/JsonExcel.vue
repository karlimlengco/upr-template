<template>
  <a
    href="#"
    :id="id_name"
    @click="generate_excel">
    <slot>
      {{button_text}}
    </slot>
  </a>
</template>

<script>
export default {
  data: function(){
    return {
      animate   : true,
      animation : '',
    }
  },
  props: {
    'button_text': {
      type: String,
      default: "Export Excel"
    },
    'data':{
      type: Array,
      required: true
    },
    'fields':{
      type: Object,
      required: true
    },
    'name':{
      type: String,
      default: "data.xls"
    },
    'items':{
      type: Array
    },
    'upr':{
    }
  },
  created: function () {
  },
  computed:{
    id_name : function(){
      var now = new Date().getTime();
      return 'export_'+now;
    },
    updateData : function() {
      let uprData = []
      for (var i in this.items) {
        uprData.push(
          {
            "ITEM DESCRIPTION"      : this.items[i].item_description,
            "QTY"      : this.items[i].quantity,
            "UNIT"      : this.items[i].unit_measurement,
            "UNIT PRICE"   : this.items[i].unit_price,
            "TOTAL AMOUNT" : this.items[i].total_amount,
            "ACCOUNT CODE" : this.items[i].new_account_code
          }
        )
      }
      return uprData
    },
    updateUPR : function() {
      return {
          "UPR NO"      : this.upr.upr_number,
          "DATE PREPARED"      : this.upr.date_prepared,
          "PROJECT NAME"   : this.upr.project_name,
          "PLACE OF DELIVERY" : this.upr.place_of_delivery,
          "MODE OF PROCUREMENT"    : this.upr.mode_of_procurement,
          "CHARGEABILITY"    : this.upr.chargeability,
          "ACCOUNT CODE"    : this.upr.new_account_code,
          "FUND VALIDITY"    : this.upr.fund_validity,
          "TERMS OF PAYMENTS"    : this.upr.terms_of_payment,
          "OTHER ESSENTIAL INFO"    : this.upr.other_infos,
          "Procurement Center / Office'"    : this.upr.procurement_office,
          "Catered Unit"    : this.upr.units,
          "Procurement Program"    : this.upr.procurement_type,
          "PURPOSE"    : this.upr.purpose,
          "Approved By"    : this.upr.approver_id,
          "Funded By"    : this.upr.fund_signatory_id,
          "Request By"    : this.upr.requestor_id,
        }
    }
  },
  methods: {
    emitXmlHeader: function () {
        var  headerRow = '';
        for (var colName in this.updateUPR) {
            headerRow +=  '<tr>\n';
            headerRow += '  <td>\n';
            headerRow += colName + '\n';
            headerRow += '  </td>\n';
            headerRow += '  <td>:</td>';
            headerRow += '  <td>\n';
            headerRow += this.updateUPR[colName] + '\n';
            headerRow += '  </td>\n';
            headerRow += '</tr>\n';
        }
        return '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Data</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>\n' +
           '<thead>\n\n' +
           headerRow+
           '</thead>\n\n'+
               '</tbody>\n';
    },

    emitXmlFooter: function() {
        return '\n</tbody>\n' +
          '</table>\n'+
          '</body>\n'+
               '</html>\n';
    },

    jsonToHtml: function (jsonObject) {
        var row;
        var col;
        var xml;
        var data = typeof jsonObject != "object"
                 ? JSON.parse(jsonObject)
                 : jsonObject;

        xml = this.emitXmlHeader();

        xml += "<tr></tr>";
        xml += "<tr> <td> ITEM DESCRIPTION</td> <td>QTY</td> <td>UNIT</td> <td>UNIT PRICE</td> <td>TOTAL AMOUNT</td><td>Account Code</td> </tr>";
        for (row = 0; row < data.length; row++) {
            xml += '<tr>\n';

            for (col in data[row]) {
                xml += '  <td>\n';
                xml += String(data[row][col])+ '\n';
                xml += '  </td>\n';
            }

            xml += '</tr>\n';
        }

        xml += this.emitXmlFooter();
        return xml;
    },

    generate_excel: function (){


          var uri = 'data:application/vnd.ms-excel;base64,'
          , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }

      var a = document.getElementById(this.id_name);
      a.href = uri + base64(this.jsonToHtml(this.updateData));
          a.download = this.name;
    }
  }
}
</script>
