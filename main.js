// main.js
// هنا ربط عناصر الفورم بالأحداث (كليك، إدخال...) واستدعاء دوال data.js و ui.js

var nameInput = document.getElementById("nameInput");
var quantityInput = document.getElementById("quantityInput");
var rejectedInput = document.getElementById("rejectedInput");
var statusInput = document.getElementById("statusInput");
var searchInput = document.getElementById("searchInput");
var searchBtn = document.getElementById("searchBtn");
var deleteAllBtn = document.getElementById("deleteAllBtn");
var addBtn = document.getElementById("addBtn");
var emptyTrashBtn = document.getElementById("emptyTrashBtn")

// إضافة دفعة جديدة، أو حفظ تعديل لو إحنا في وضع التعديل
function addBatch() {
  var name = nameInput.value.trim();
  var quantity = Number(quantityInput.value);
  var rejected = Number(rejectedInput.value);

  if (!name || !quantity) {
    alert("write a Quantity and proudaction Name")
    return;
  }
  if (rejected > quantity) {
    alert("Rejected Quantity cannot exeed the Total quality")
  }

  if (editingIndex !== null) {
    updateBatchData(editingIndex, name, quantity, rejected, statusInput.value);
    editingIndex = null;
    addBtn.textContent = "إضافة دفعة";
  } else {
    addBatchAsUnits(name, quantity, rejected);
  }

  clearForm();
  displayBatches(searchInput.value);
}

// بتحمل بيانات صف معين في الفورم عشان تتعدل
function loadBatchIntoForm(index) {
  var batch = batches[index];

  nameInput.value = batch.name;
  quantityInput.value = batch.quantity;
  rejectedInput.value = batch.rejected;
  statusInput.value = batch.status;

  editingIndex = index;
  addBtn.textContent = "حفظ التعديل";
}

function clearForm() {
  nameInput.value = "";
  quantityInput.value = "";
  rejectedInput.value = "";
}

addBtn.addEventListener("click", addBatch);

// البحث بزرار، وكمان بمفتاح Enter وإحنا في الخانة
searchBtn.addEventListener("click", function () {
  displayBatches(searchInput.value);
});
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") displayBatches(searchInput.value);
});

// حذف كل الدفعات - بعد تأكيد، عشان محدش يمسح بالغلط
deleteAllBtn.addEventListener("click", function () {
  if (batches.length === 0) return;
  var sure = confirm("are u sure? u want delete it!");
  if (sure) {
    deleteAllData();
    displayBatches(searchInput.value);
  }
});

// أول ما الصفحة تفتح: نحمّل أي بيانات محفوظة من قبل، وبعدين نعرضها
loadFromStorage();
// emptyTrash()
displayBatches("");

emptyTrashBtn.addEventListener("click", function () {
  if (deletedBatches.length === 0) return;
  var sure = confirm("are u sure in the trash will delete finally");
  if (sure) {
    emptyTrash()
    displayTrash()
  }
})