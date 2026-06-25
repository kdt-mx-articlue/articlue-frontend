import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { getCoverLetterDetail, updateCoverLetter } from "../../services/coverLetterService";

export default function CoverLetterDetailPage() {
  const { coverLetterId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [coverLetter, setCoverLetter] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedItems, setEditedItems] = useState([]);

  useEffect(() => {
    loadCoverLetter();
  }, [coverLetterId]);

  const loadCoverLetter = async () => {
    try {
      const data = await getCoverLetterDetail(coverLetterId);
      setCoverLetter(data);
      setEditedItems(data?.items ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter?.items) return;
    const text = coverLetter.items
      .map((item) => `[${item.question}]\n\n${item.answer}`)
      .join("\n\n\n");
    await navigator.clipboard.writeText(text);
    alert("복사되었습니다.");
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await updateCoverLetter(coverLetterId, editedItems);
      setCoverLetter((prev) => ({ ...prev, items: editedItems }));
      setEditMode(false);
    } catch (e) {
      alert("저장 실패: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1120px] py-10 text-center text-slate-500">
        로딩중...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1120px] space-y-10 py-6">
      {saving && <LoadingOverlay />}

      <PageHero
        badge="자소서 상세"
        title={coverLetter ? `${coverLetter.companyName} ${coverLetter.jobTitle}` : "자기소개서"}
        description="생성된 자기소개서를 확인하고 관리할 수 있습니다."
        statTitle="문항 수"
        statValue={coverLetter?.items?.length || 0}
        statDescription="생성된 문항"
      />

      <section className="rounded-[32px] border border-slate-200 bg-white p-8 dark:bg-slate-900 dark:border-slate-700">
        {!coverLetter && (
          <div className="text-center text-slate-500">자기소개서가 존재하지 않습니다.</div>
        )}

        {coverLetter && (
          <>
            {/* 액션 버튼 */}
            <div className="flex justify-end gap-3 mb-8">
              <button
                type="button"
                onClick={handleCopy}
                className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                복사하기
              </button>
              {editMode ? (
                <>
                  <button
                    type="button"
                    onClick={() => { setEditMode(false); setEditedItems(coverLetter.items); }}
                    className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:text-slate-300"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    저장하기
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  수정하기
                </button>
              )}
            </div>

            {/* 문항별 내용 */}
            {(editMode ? editedItems : coverLetter.items).map((item, index) => (
              <div
                key={item.coverLetterItemId ?? index}
                className="mb-10 pb-10 border-b border-slate-200 dark:border-slate-700 last:border-0"
              >
                <div className="text-xl font-black mb-3 text-blue-600">Q{index + 1}</div>
                <div className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-lg">
                  {item.question}
                </div>
                {editMode ? (
                  <textarea
                    className="w-full min-h-[200px] p-4 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 leading-8 resize-y text-slate-700"
                    value={editedItems[index]?.answer ?? ""}
                    onChange={(e) => {
                      const updated = [...editedItems];
                      updated[index] = { ...updated[index], answer: e.target.value };
                      setEditedItems(updated);
                    }}
                  />
                ) : (
                  <div className="whitespace-pre-wrap leading-8 text-slate-700 dark:text-slate-300">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
}
