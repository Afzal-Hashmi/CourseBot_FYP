// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import TeacherSidebar from "./teacher_sidebar";

// const StudentsManagement = () => {
//   const [studentsData, setStudentsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCourseMap, setSelectedCourseMap] = useState({});

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const token = Cookies.get("token");
//         const response = await fetch("http://localhost:8000/teacher/getstudents", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const result = await response.json();
//         if (result?.succeeded) {
//           setStudentsData(result.data);
//         }
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const handleRemove = (enrollmentId, courseId) => {
//     console.log("Remove student from course", courseId, "with enrollment_id", enrollmentId);
//     // Make your remove API call here
//   };

//   const handleCourseChange = (email, selectedCourseId) => {
//     const courseData = studentsData.find(
//       (student) => student.student_email === email && student.course_id === selectedCourseId
//     );
//     if (courseData) {
//       setSelectedCourseMap((prev) => ({
//         ...prev,
//         [email]: {
//           course_id: courseData.course_id,
//           enrollment_id: courseData.enrollment_id,
//         },
//       }));
//     }
//   };

//   const groupByStudent = (data) => {
//     const grouped = {};
//     data.forEach((item) => {
//       if (!grouped[item.student_email]) {
//         grouped[item.student_email] = {
//           name: `${capitalize(item.student_firstname)} ${capitalize(item.student_lastname)}`,
//           email: item.student_email,
//           courses: [],
//         };
//       }
//       grouped[item.student_email].courses.push({
//         name: item.course_name,
//         enrollment_id: item.enrollment_id,
//         course_id: item.course_id,
//       });
//     });
//     return Object.values(grouped);
//   };

//   const capitalize = (str) =>
//     str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

//   const groupedStudents = groupByStudent(studentsData);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <TeacherSidebar />
//       <div className="flex-1 ml-0 lg:ml-72 p-4 sm:p-6 lg:p-8 transition-all duration-300">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
//           Student Management
//         </h1>

//         <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
//                     Student Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
//                     Enrolled Courses
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {loading ? (
//                   Array(4)
//                     .fill()
//                     .map((_, idx) => (
//                       <tr key={idx} className="animate-pulse">
//                         <td className="px-6 py-4">
//                           <div className="h-4 bg-gray-200 rounded w-32" />
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="h-4 bg-gray-200 rounded w-40" />
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="h-4 bg-gray-200 rounded w-60" />
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="h-8 bg-gray-200 rounded w-24" />
//                         </td>
//                       </tr>
//                     ))
//                 ) : groupedStudents.length > 0 ? (
//                   groupedStudents.map((student) => {
//                     const selectedCourse =
//                       selectedCourseMap[student.email] ||
//                       student.courses[0];
//                     return (
//                       <tr key={student.email}>
//                         <td className="px-6 py-4 font-bold text-gray-900">
//                           {student.name}
//                         </td>
//                         <td className="px-6 py-4 text-gray-600">
//                           {student.email}
//                         </td>
//                         <td className="px-6 py-4">
//                           <select
//                             onChange={(e) =>
//                               handleCourseChange(
//                                 student.email,
//                                 parseInt(e.target.value)
//                               )
//                             }
//                             className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
//                           >
//                             {student.courses.map((course, idx) => (
//                               <option
//                                 key={idx}
//                                 value={course.course_id}
//                                 selected={
//                                   course.course_id === selectedCourse.course_id
//                                 }
//                               >
//                                 {course.name}
//                               </option>
//                             ))}
//                           </select>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() =>
//                                 handleRemove(
//                                   selectedCourse.enrollment_id,
//                                   selectedCourse.course_id
//                                 )
//                               }
//                               className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl text-sm font-semibold"
//                             >
//                               Remove
//                             </button>
//                             <a
//                               href={`mailto:${student.email}?subject=Course%20Notice&body=Hello%20${student.name.split(" ")[0]},%0D%0A%0D%0AI%20wanted%20to%20discuss%20your%20enrollment%20in%20the%20course.%0D%0A%0D%0ABest,%0D%0ATeacher`}
//                               className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl text-sm font-semibold"
//                             >
//                               Message
//                             </a>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan="4"
//                       className="text-center py-4 text-gray-500 text-sm"
//                     >
//                       No students found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentsManagement;



import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import TeacherSidebar from "./teacher_sidebar";

const StudentsManagement = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseMap, setSelectedCourseMap] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch("http://localhost:8000/teacher/getstudents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result?.succeeded) {
          setStudentsData(result.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleRemove = (enrollmentId, courseId) => {
    console.log("Remove student from course", courseId, "with enrollment_id", enrollmentId);
    // Call your backend here
  };

  const handleCourseChange = (email, selectedCourseId) => {
    const courseData = studentsData.find(
      (student) => student.student_email === email && student.course_id === selectedCourseId
    );
    if (courseData) {
      setSelectedCourseMap((prev) => ({
        ...prev,
        [email]: {
          course_id: courseData.course_id,
          enrollment_id: courseData.enrollment_id,
        },
      }));
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const groupByStudent = (data) => {
    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.student_email]) {
        grouped[item.student_email] = {
          name: `${capitalize(item.student_firstname)} ${capitalize(item.student_lastname)}`,
          email: item.student_email,
          courses: [],
        };
      }
      grouped[item.student_email].courses.push({
        name: item.course_name,
        enrollment_id: item.enrollment_id,
        course_id: item.course_id,
      });
    });
    return Object.values(grouped);
  };

  const groupedStudents = groupByStudent(studentsData);

  const filteredStudents = groupedStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <div className="flex-1 ml-0 lg:ml-72 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Student Management
          </h1>
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Enrolled Courses
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array(4)
                    .fill()
                    .map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-32" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-40" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-60" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-8 bg-gray-200 rounded w-24" />
                        </td>
                      </tr>
                    ))
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const selectedCourse =
                      selectedCourseMap[student.email] || student.courses[0];
                    return (
                      <tr key={student.email}>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {student.email}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            onChange={(e) =>
                              handleCourseChange(
                                student.email,
                                parseInt(e.target.value)
                              )
                            }
                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                          >
                            {student.courses.map((course, idx) => (
                              <option
                                key={idx}
                                value={course.course_id}
                                selected={
                                  course.course_id === selectedCourse.course_id
                                }
                              >
                                {course.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleRemove(
                                  selectedCourse.enrollment_id,
                                  selectedCourse.course_id
                                )
                              }
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl text-sm font-semibold"
                            >
                              Remove
                            </button>
                            <a
                              href={`mailto:${student.email}?subject=Course%20Notice&body=Hello%20${student.name.split(" ")[0]},%0D%0A%0D%0AI%20wanted%20to%20discuss%20your%20enrollment%20in%20the%20course.%0D%0A%0D%0ABest,%0D%0ATeacher`}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl text-sm font-semibold"
                            >
                              Message
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500 text-sm">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsManagement;
