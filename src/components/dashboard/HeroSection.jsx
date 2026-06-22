// export default function HeroSection({
//   readiness = 0,
// }) {
//   return (
//     <section
//       className="
//         relative
//         overflow-hidden
//         rounded-[36px]
//         bg-gradient-to-r
//         from-blue-700
//         via-blue-600
//         to-blue-500
//         px-7
//         py-6
//         text-white
//       "
//     >
//       <div
//         className="
//           absolute
//           right-[-80px]
//           top-[-80px]
//           h-[220px]
//           w-[200px]
//           rounded-full
//           bg-white/10
//         "
//       />

//       <div
//         className="
//           absolute
//           right-[80px]
//           top-[-100px]
//           h-[180px]
//           w-[180px]
//           rounded-full
//           bg-white/5
//         "
//       />

//       <div
//         className="
//           relative
//           flex
//           items-center
//           justify-between
//           gap-8
//         "
//       >

//         <div className="max-w-[520px]">

//           <div className="mb-4 flex gap-3">

//             <div
//               className="
//                 rounded-full
//                 bg-white/10
//                 px-4
//                 py-2
//                 text-xs
//                 font-black
//                 backdrop-blur
//               "
//             >
//               ● 오늘의 커리어 대시보드
//             </div>

//             <div
//               className="
//                 rounded-full
//                 bg-white/10
//                 px-4
//                 py-2
//                 text-xs
//                 font-black
//                 backdrop-blur
//               "
//             >
//               AI 기반 데이터 표시
//             </div>

//           </div>

//           <h1
//             className="
//               text-[32px]
//               font-black
//               leading-tight
//             "
//           >
//             합격 가능성을 높이기 위한
//             현재 나의 커리어 상태를
//             확인하세요
//           </h1>

//           <p
//             className="
//               mt-4
//               text-sm
//               leading-7
//               text-blue-50
//             "
//           >
//             이력서, 면접, 자소서 활동을
//             기반으로 취업 준비 현황을
//             확인할 수 있습니다.
//           </p>

//         </div>

//         <div
//           className="
//             w-[240px]
//             rounded-[28px]
//             border
//             border-white/20
//             bg-white/10
//             p-5
//             backdrop-blur
//           "
//         >
//           <div
//             className="
//               text-xs
//               font-black
//               text-blue-100
//             "
//           >
//             취업 준비도
//           </div>

//           <div
//             className="
//               mt-2
//               text-[48px]
//               font-black
//               leading-none
//             "
//           >
//             {readiness}%
//           </div>

//           <div
//             className="
//               mt-4
//               h-3
//               rounded-full
//               bg-white/20
//             "
//           >
//             <div
//               className="
//                 h-full
//                 rounded-full
//                 bg-green-200
//               "
//               style={{
//                 width: `${readiness}%`,
//               }}
//             />
//           </div>

//           <p
//             className="
//               mt-4
//               text-xs
//               leading-6
//               text-blue-50
//             "
//           >
//             이력서 완성도 · 면접 활동 ·
//             자소서 활동 기반
//           </p>

//         </div>

//       </div>
//     </section>
//   );
// }