// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { UserHeader } from '../components/user/UserHeader';
// import { UserStats } from '../components/user/UserStats';
// import { UserPets } from '../components/user/UserPets';
// import { UserReviews } from '../components/user/UserReviews';
// import { UserSettings } from '../components/user/UserSettings';
// import { useUser } from '../hooks/useUser';

// export function UserProfile() {
//   const { id } = useParams();
//   const { user, loading, error, isCurrentUser } = useUser(id);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center ">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error || !user) {
//     return (
//       <div className="flex items-center justify-center  text-red-600">
//         {error?.message || 'User not found'}
//       </div>
//     );
//   }

//   return (
//     <div className=" bg-gray-50">
//       <UserHeader user={user} isCurrentUser={isCurrentUser} />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-8">
//             <UserPets userId={user.id} />
//             <UserReviews userId={user.id} />
//           </div>

//           <div className="space-y-8">
//             <UserStats userId={user.id} />
//             {isCurrentUser && <UserSettings user={user} />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
