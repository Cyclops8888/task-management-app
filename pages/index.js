import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Upload, FileText } from 'lucide-react';

const TaskManagementApp = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      no: 1,
      requestDate: '2025-10-28',
      workName: '「飲むシリカ」に於ける完全非結晶化のエビデンス',
      requestContent: '東京都立産業技術研究センター提出用のシリカ水溶液作成',
      testInstitution: '東京都立産業技術研究センター',
      desiredDelivery: '2025-11-14',
      status: '11/7：都産技研の仮申し込み完了',
      person: '本田・芳賀',
      pdfUrl: null,      // ← 追加
      pdfName: null      // ← 追加
    },
    {
      id: 2,
      no: 2,
      requestDate: '2025-10-28',
      workName: '事業再構築補助金に於ける事務局への経過報告',
      requestContent: '断熱材等施策第1〜2号と言い訳材料',
      testInstitution: '現時点では必要なし',
      desiredDelivery: '2025-11-29',
      status: '',
      person: '芳賀',
      pdfUrl: null,      // ← 追加
      pdfName: null      // ← 追加
    },
    {
      id: 3,
      no: 3,
      requestDate: '2025-10-28',
      workName: 'FT-IR試験',
      requestContent: 'ニッセンケンのFT-IR試験に準ずる',
      testInstitution: 'ニッセンケン',
      desiredDelivery: '2025-11-29',
      status: '',
      person: '',
      pdfUrl: null,      // ← 追加
      pdfName: null      // ← 追加
    },
    {
      id: 4,
      no: 4,
      requestDate: '2025-10-28',
      workName: '吸湿発熱試験(ニッセンケン)',
      requestContent: 'ニッセンケンの吸湿発熱性試験に準じる',
      testInstitution: 'ニッセンケン',
      desiredDelivery: '2025-11-29',
      status: '',
      person: '',
      pdfUrl: null,      // ← 追加
      pdfName: null      // ← 追加
    },
    {
      id: 5,
      no: 5,
      requestDate: '2025-10-28',
      workName: '吸湿発熱試験(ビスマス)',
      requestContent: 'ニッセンケンの吸湿発熱性試験に準じる',
      testInstitution: 'ニッセンケン',
      desiredDelivery: '2025-12-31',
      status: '',
      person: '',
      pdfUrl: null,      // ← 追加
      pdfName: null      // ← 追加
    },
    {
      id: 6,
      no: 6,
      requestDate: '2025-10-28',
      workName: '持続冷感（ビスマス）＋UVカット',
      requestContent: 'ニッセンケンの吸湿発熱性及びUV試験に準じる',
      testInstitution: 'ニッセンケン',
      desiredDelivery: '2026-01-31',
      status: '',
      person: '',
      pdfUrl: null,      // ← 追加
      pdfName: null      // ← 追加
    },
    {
      id: 7,
      no: 7,
      requestDate: '2025-11-11',
      workName: 'FT-IR試験（ニッセンケン）',
      requestContent: 'ニッセンケンのFT-IR試験に準ずる',
      testInstitution: 'ニッセンケン',
      desiredDelivery: '2025-11-20',
      status: '',
      person: '',
      pdfUrl: null,      // ← 追加
      pdfName: null      // ← 追加
    },
    {
      id: 8,
      no: 8,
      requestDate: '2025-11-11',
      workName: '45℃パラレル再放射法',
      requestContent: 'ボーケン45℃パラレル再放射法に準じる',
      testInstitution: 'ボーケン',
      desiredDelivery: '2025-11-20',
      status: '',
      person: '',
      pdfUrl: null,      // ← 追加
      pdfName: null      // ← 追加
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    requestDate: '',
    workName: '',
    requestContent: '',
    testInstitution: '',
    desiredDelivery: '',
    status: '',
    person: '',
    pdfUrl: null,      // ← 追加
    pdfName: null      // ← 追加
  });

  // ← 新規追加：PDF関連のstate
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editSelectedFile, setEditSelectedFile] = useState(null);

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditForm(task);
    setEditSelectedFile(null);  // ← 追加
  };

  const handleSave = async () => {
    let updatedForm = { ...editForm };

    // ← 新規追加：編集時に新しいPDFがアップロードされた場合
    if (editSelectedFile) {
      setUploading(true);
      try {
        // 古いPDFを削除
        if (editForm.pdfUrl) {
          await fetch('/api/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: editForm.pdfUrl }),
          });
        }

        // 新しいPDFをアップロード
        const formData = new FormData();
        formData.append('file', editSelectedFile);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        
        if (response.ok) {
          updatedForm.pdfUrl = data.url;
          updatedForm.pdfName = data.fileName;
        } else {
          alert('PDFのアップロードに失敗しました: ' + data.error);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('PDFのアップロードに失敗しました');
      } finally {
        setUploading(false);
        setEditSelectedFile(null);
      }
    }

    setTasks(tasks.map(task => task.id === editingId ? updatedForm : task));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setEditSelectedFile(null);  // ← 追加
  };

  const handleDelete = async (id) => {
    if (window.confirm('このタスクを削除しますか？')) {
      const task = tasks.find(t => t.id === id);
      
      // ← 新規追加：PDFも削除
      if (task?.pdfUrl) {
        try {
          await fetch('/api/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: task.pdfUrl }),
          });
        } catch (error) {
          console.error('PDF削除エラー:', error);
        }
      }
      
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleAdd = async () => {
    setUploading(true);
    let pdfUrl = null;
    let pdfName = null;

    // ← 新規追加：PDFアップロード処理
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        
        if (response.ok) {
          pdfUrl = data.url;
          pdfName = data.fileName;
        } else {
          alert('PDFのアップロードに失敗しました: ' + data.error);
          setUploading(false);
          return;
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('PDFのアップロードに失敗しました');
        setUploading(false);
        return;
      }
    }

    const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
    const newNo = Math.max(...tasks.map(t => t.no), 0) + 1;
    setTasks([...tasks, { ...newTask, id: newId, no: newNo, pdfUrl, pdfName }]);
    setNewTask({
      requestDate: '',
      workName: '',
      requestContent: '',
      testInstitution: '',
      desiredDelivery: '',
      status: '',
      person: '',
      pdfUrl: null,      // ← 追加
      pdfName: null      // ← 追加
    });
    setSelectedFile(null);  // ← 追加
    setShowAddForm(false);
    setUploading(false);
  };

  // ← 新規追加：PDF削除ハンドラ
  const handleRemovePdf = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task?.pdfUrl) return;

    if (window.confirm('このPDFを削除しますか？')) {
      try {
        await fetch('/api/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: task.pdfUrl }),
        });
        
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, pdfUrl: null, pdfName: null } : t
        ));
      } catch (error) {
        console.error('PDF削除エラー:', error);
        alert('PDFの削除に失敗しました');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">杉戸工場作業依頼管理</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              新規タスク追加
            </button>
          </div>

          {showAddForm && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-4">新規タスク追加</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  placeholder="依頼日"
                  value={newTask.requestDate}
                  onChange={(e) => setNewTask({...newTask, requestDate: e.target.value})}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="作業名称"
                  value={newTask.workName}
                  onChange={(e) => setNewTask({...newTask, workName: e.target.value})}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="依頼内容"
                  value={newTask.requestContent}
                  onChange={(e) => setNewTask({...newTask, requestContent: e.target.value})}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="試験機関"
                  value={newTask.testInstitution}
                  onChange={(e) => setNewTask({...newTask, testInstitution: e.target.value})}
                  className="p-2 border rounded"
                />
                <input
                  type="date"
                  placeholder="希望納期"
                  value={newTask.desiredDelivery}
                  onChange={(e) => setNewTask({...newTask, desiredDelivery: e.target.value})}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="担当者"
                  value={newTask.person}
                  onChange={(e) => setNewTask({...newTask, person: e.target.value})}
                  className="p-2 border rounded"
                />
                <textarea
                  placeholder="進捗状況"
                  value={newTask.status}
                  onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                  className="p-2 border rounded md:col-span-2"
                  rows="2"
                />
                {/* ← 新規追加：PDFアップロードフィールド */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    <Upload size={16} className="inline mr-1" />
                    PDF添付（任意）
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full p-2 border rounded"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      選択中: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAdd}
                  disabled={uploading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  {uploading ? 'アップロード中...' : '追加'}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedFile(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition">
                {editingId === task.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">依頼日</label>
                        <input
                          type="date"
                          value={editForm.requestDate}
                          onChange={(e) => setEditForm({...editForm, requestDate: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">作業名称</label>
                        <input
                          type="text"
                          value={editForm.workName}
                          onChange={(e) => setEditForm({...editForm, workName: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">依頼内容</label>
                        <input
                          type="text"
                          value={editForm.requestContent}
                          onChange={(e) => setEditForm({...editForm, requestContent: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">試験機関</label>
                        <input
                          type="text"
                          value={editForm.testInstitution}
                          onChange={(e) => setEditForm({...editForm, testInstitution: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">希望納期</label>
                        <input
                          type="date"
                          value={editForm.desiredDelivery}
                          onChange={(e) => setEditForm({...editForm, desiredDelivery: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">担当者</label>
                        <input
                          type="text"
                          value={editForm.person}
                          onChange={(e) => setEditForm({...editForm, person: e.target.value})}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-gray-600">進捗状況</label>
                        <textarea
                          value={editForm.status}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                          className="w-full p-2 border rounded"
                          rows="2"
                        />
                      </div>
                      {/* ← 新規追加：編集時のPDFアップロード */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                          <Upload size={16} className="inline mr-1" />
                          PDF添付
                        </label>
                        {editForm.pdfUrl && !editSelectedFile && (
                          <div className="mb-2 p-2 bg-gray-100 rounded flex items-center justify-between">
                            <a
                              href={editForm.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <FileText size={16} />
                              {editForm.pdfName}
                            </a>
                            <button
                              onClick={() => setEditForm({...editForm, pdfUrl: null, pdfName: null})}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              削除
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setEditSelectedFile(e.target.files?.[0] || null)}
                          className="w-full p-2 border rounded"
                        />
                        {editSelectedFile && (
                          <p className="text-sm text-gray-600 mt-1">
                            新しいファイル: {editSelectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={uploading}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:bg-gray-400"
                      >
                        <Save size={16} />
                        {uploading ? 'アップロード中...' : '保存'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-1 bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        <X size={16} />
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            No.{task.no}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800">{task.workName}</h3>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-gray-600">依頼日：</span>
                        <span className="text-gray-800">{task.requestDate}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">希望納期：</span>
                        <span className="text-gray-800">{task.desiredDelivery}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-semibold text-gray-600">依頼内容：</span>
                        <span className="text-gray-800">{task.requestContent}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">試験機関：</span>
                        <span className="text-gray-800">{task.testInstitution}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">担当者：</span>
                        <span className="text-gray-800">{task.person}</span>
                      </div>
                      {/* ← 新規追加：PDF表示 */}
                      {task.pdfUrl && (
                        <div className="md:col-span-2">
                          <span className="font-semibold text-gray-600">添付PDF：</span>
                          <a
                            href={task.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-2 inline-flex items-center gap-1"
                          >
                            <FileText size={16} />
                            {task.pdfName}
                          </a>
                          <button
                            onClick={() => handleRemovePdf(task.id)}
                            className="ml-3 text-red-600 hover:text-red-800 text-sm"
                          >
                            削除
                          </button>
                        </div>
                      )}
                      {task.status && (
                        <div className="md:col-span-2 bg-yellow-50 p-2 rounded">
                          <span className="font-semibold text-gray-600">進捗：</span>
                          <span className="text-gray-800">{task.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagementApp;
