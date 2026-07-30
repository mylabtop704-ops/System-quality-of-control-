// data.js
// هنا بس البيانات والمنطق اللي مالوش علاقة بالشاشة (مفيش document.getElementById هنا)

// 1) مكان تخزين كل الدفعات في الذاكرة
var batches = [];

// سلة المهملات - أي دفعة اتحذفت بتترحّل هنا بدل ما تضيع خالص
var deletedBatches = [];

// لو مش بنعدل حاجة، القيمة null - لو بنعدل، بتبقى رقم انديكس الصف
var editingIndex = null;

// بتحسب نسبة الجودة لأي دفعة
function calcQualityRate(batch) {
  return ((batch.quantity - batch.rejected) / batch.quantity) * 100;
}

// بتحول الحالة العربي لاسم كلاس CSS (بالإنجليزي عشان الكلاسات)
function statusClass(status) {
  if (status === "مقبول") return "good";
  if (status === "قيد الفحص") return "pending";
  return "bad";
}

// بتحفظ batches و deletedBatches في localStorage - عشان البيانات متضيعش مع الريفريش
function saveToStorage() {
  localStorage.setItem("qc_batches", JSON.stringify(batches));
  localStorage.setItem("qc_deleted", JSON.stringify(deletedBatches));
}

// بتقرأ البيانات المحفوظة وقت ما الصفحة تفتح من جديد
function loadFromStorage() {
  var savedBatches = localStorage.getItem("qc_batches");
  var savedDeleted = localStorage.getItem("qc_deleted");

  if (savedBatches) batches = JSON.parse(savedBatches);
  if (savedDeleted) deletedBatches = JSON.parse(savedDeleted);
}

// بتضيف دفعة جديدة للـ array
function addBatchData(name, quantity, rejected, status) {
  batches.push({
    name: name,
    quantity: quantity,
    rejected: rejected || 0,
    status: status
  });
  saveToStorage();
}

// بتوزع الكمية على صفوف مستقلة: كل صف = قطعة واحدة (quantity: 1)
// أول "rejected" قطعة بتتسجل مرفوضة، والباقي مقبول
function addBatchAsUnits(name, quantity, rejected) {
  rejected = rejected || 0;
  for (var i = 0; i < quantity; i++) {
    var isRejected = i < rejected;
    batches.push({
      name: name,
      quantity: 1,
      rejected: isRejected ? 1 : 0,
      status: isRejected ? "مرفوض" : "مقبول"
    });
  }
  saveToStorage();
}

// بتحدث دفعة موجودة بالانديكس بتاعها
function updateBatchData(index, name, quantity, rejected, status) {
  batches[index] = {
    name: name,
    quantity: quantity,
    rejected: rejected || 0,
    status: status
  };
  saveToStorage();
}

// بتمسح دفعة بالانديكس بتاعها - بترحّلها لسلة المهملات بدل ما تمسحها نهائي
function deleteBatchData(index) {
  var removed = batches.splice(index, 1)[0];
  deletedBatches.unshift(removed); // بتحطها في أول سلة المهملات
  saveToStorage();
}

// بتحذف كل الدفعات مرة واحدة - وبرضو بترحّلهم لسلة المهملات
function deleteAllData() {
  while (batches.length > 0) {
    deletedBatches.unshift(batches.pop());
  }
  saveToStorage();
}

// بترجع دفعة من سلة المهملات لأعلى الجدول الأصلي
function restoreBatchData(trashIndex) {
  var restored = deletedBatches.splice(trashIndex, 1)[0];
  batches.unshift(restored); // بترجعها فوق
  saveToStorage();
}

// بتمسح دفعة من سلة المهملات نهائيًا - من غير ما ترجع لأي مكان
function permanentlyDeleteData(trashIndex) {
  deletedBatches.splice(trashIndex, 1);
  saveToStorage();
}

function emptyTrash(){
  deletedBatches=[];
  saveToStorage()
}

// بترجع بس الدفعات اللي مطابقة لكلمة البحث (بالاسم أو الحالة)
// كل عنصر راجع بيحتوي على الانديكس الحقيقي بتاعه في batches، عشان الحذف والتعديل يفضلوا شغالين بعد الفلترة
function filterBatches(filterText) {
  filterText = (filterText || "").trim();

  var result = [];
  batches.forEach(function (batch, index) {
    if (!filterText ||
        batch.name.indexOf(filterText) !== -1 ||
        batch.status.indexOf(filterText) !== -1) {
      result.push({ batch: batch, index: index });
    }
  });
  return result;
}
