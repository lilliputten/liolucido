import { siteConfig } from '@/config/site';
import { constructMetadata } from '@/lib/utils';
import { DemoList } from '@/components/debug/DemoList';

// import {
//   // Some methods are used for manual tests only
//   // addRecord,
//   // deleteRecord,
//   // fetchRecordsByParent,
//   fetchRecordsByParentWithChildrenCount,
// } from '@/features/records/actions';

export const pageTitle = 'Test';
export const pageDescription = 'Test page';

export const metadata = constructMetadata({
  title: pageTitle + ' - ' + siteConfig.name,
  description: pageDescription,
});

export async function TestPage() {
  /* // Tests:
   * const rootRecords = await fetchRecordsByParentWithChildrenCount();
   * const allRecords = await fetchRecordsByParent();
   * const allRecordsCount = allRecords.length;
   * const firstRecord = allRecords[0];
   * const parentId = firstRecord?.id;
   * const checkAddRecord = allRecordsCount <= 2;
   * const checkDeleteRecord = false && allRecordsCount > 2;
   * const checkChildrenRecords = allRecordsCount > 1;
   * const newRecord = {
   *   name: allRecordsCount ? 'Child record ' + allRecordsCount : 'Parent record',
   *   parentId,
   * };
   * if (checkChildrenRecords) {
   *   const childrenRecords = parentId ? await fetchRecordsByParent({ parentId }) : undefined;
   *   console.log('[TestPage] checkChildrenRecords', {
   *     childrenRecords,
   *   });
   * }
   * if (checkAddRecord) {
   *   const addedRecord = checkAddRecord ? await addRecord(newRecord) : undefined;
   *   const debugRecords = allRecords;
   *   if (addedRecord) {
   *     allRecords.push(addedRecord);
   *   }
   *   console.log('[TestPage] checkAddRecord', {
   *     addedRecord,
   *     debugRecords,
   *   });
   * }
   * if (checkDeleteRecord) {
   *   const lastRecord = allRecords[allRecordsCount - 1];
   *   const deletedRecord = await deleteRecord(lastRecord.id);
   *   console.log('[TestPage] checkDeleteRecord', {
   *     lastRecord,
   *     deletedRecord,
   *   });
   * }
   * console.log('[TestPage]', {
   *   rootRecords,
   * });
   */
  return (
    <div>
      <div>Application: {siteConfig.versionInfo}</div>
      <DemoList count={50} />
    </div>
  );
}
