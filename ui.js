// ui.js
// هنا بس اللي بيرسم على الشاشة (الجدول والصفوف). البيانات نفسها في data.js

var tableBody = document.getElementById("tableBody");
var trashList = document.getElementById("trashList");

// بترسم الجدول كله من جديد، ولو فيه كلمة بحث بتعرض المطابق بس
function displayBatches(filterText) {
  tableBody.innerHTML = "";
  var entries = filterBatches(filterText);

  entries.forEach(function (entry, position) {
    var batch = entry.batch;
    var index = entry.index;
    var rate = calcQualityRate(batch);
    var cls = statusClass(batch.status);

    var row = document.createElement("tr");
    row.className = "row-" + cls;
    row.innerHTML =
      "<td>" + (position + 1) + "</td>" +
      "<td>" + batch.name + "</td>" +
      "<td class='qty'>" + batch.quantity + "</td>" +
      "<td class='qty'>" + batch.rejected + "</td>" +
      "<td class='rate'>" + rate.toFixed(1) + "%</td>" +
      "<td><span class='badge " + cls + "'>" + batch.status + "</span></td>" +
      "<td><div class='action-group'>" +
      "<button onclick='handleEditClick(" + index + ")'>تعديل</button>" +
      "<button onclick='handleDeleteClick(" + index + ")'>حذف</button>" +
      "</div></td>";

    tableBody.appendChild(row);
  });

  displayTrash();
}

// بترسم سلة المهملات (الدفعات المحذوفة) مع زرار استرجاع لكل واحدة
function displayTrash() {
  trashList.innerHTML = "";

  if (deletedBatches.length === 0) {
    trashList.innerHTML = "<p class='trash-empty'>مفيش حاجة محذوفة دلوقتي</p>";
    return;
  }

  deletedBatches.forEach(function (batch, trashIndex) {
    var item = document.createElement("div");
    item.className = "trash-item";
    item.innerHTML =
      "<span>" + batch.name + " — " + batch.quantity + " قطعة (" + batch.status + ")</span>" +
      "<div class='trash-actions'>" +
      "<button class='restore-btn' onclick='handleRestoreClick(" + trashIndex + ")'>استرجاع</button>" +
      "<button class='delete-forever-btn' onclick='handlePermanentDeleteClick(" + trashIndex + ")'>حذف نهائي</button>" +
      "</div>";
    trashList.appendChild(item);
  });
}

// الدوال الثلاثة دول بينادى عليهم مباشرة من الزرار نفسه (onclick) وقت الضغط
// - مفيش addEventListener هنا، ومفيش رقم index بينضاع بين الرسم والضغط

function handleDeleteClick(index) {
  deleteBatchData(index);
  displayBatches(searchInput.value);
}

function handleEditClick(index) {
  loadBatchIntoForm(index); // الدالة دي في main.js
}

function handleRestoreClick(trashIndex) {
  restoreBatchData(trashIndex);
  displayBatches(searchInput.value);
}

function handlePermanentDeleteClick(trashIndex) {
  var sure = confirm("متأكدة؟ الحذف ده نهائي ومش هيترجع بعد كده خالص.");
  if (!sure) return;
  permanentlyDeleteData(trashIndex);
  displayTrash();
}
