import { useEffect, useState } from "react";
import axios from "axios";

function CompanyList() {
  const [companies, setCompanies] = useState([]); // luôn là []

  useEffect(() => {
    axios.get("http://localhost:8080/api/companies", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      console.log("API data:", res.data); // debug
      // nếu API trả về object {content: [...]} thì phải res.data.content
      setCompanies(Array.isArray(res.data) ? res.data : res.data.content || []);
    })
    .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Danh sách công ty</h2>
      <ul>
        {companies.map(c => (
          <li key={c.id}>
            {c.name} - {c.address}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyList;
