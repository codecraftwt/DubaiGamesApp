import axios from 'axios';

const API_URL = 'https://staging.rdnidhi.com/api/results-till-yesterday';

export const getChartData = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzIwMDJkNDY2YTIzZDY3OWQ0YTY0NTAwYWVmOTg0ZGEwZTdlNDNiOTQ0NmEwYTBlMzMxNTI0ZTYyNzdmZjkxODM5MWRhMTI5MWJkZDdmY2EiLCJpYXQiOjE3NzI3OTM3NDkuMDQ5NDgxLCJuYmYiOjE3NzI3OTM3NDkuMDQ5NDgzLCJleHAiOjE4MDQzMjk3NDkuMDQ3MTQ4LCJzdWIiOiIxNTMiLCJzY29wZXMiOltdfQ.d1tofM29G1fokcNIvt3LCYyGy1Dmip5UX1Q7Gtpkqc9Fh5XJhIb8zEyOmTrsdwTr1b0XdjTW_kemQr9uOpFYJHxoqpWwv7-Z3kmdHEDCYQoA3z9NE2hsBw0fyAcTXmZoyGW_fD19bXrrISS_9z42NiDGtwW_9DM2C4AfxN9NKtqtocBe7OLabZ9kuo-q2Vt9IU2FdXUv3avpfyzn1K6yOJLAl02nISt_Bf6RjRCNfFNR6coeotF15BvuxTC1hba8rIB9EaiWRUN_cEXCe42FHyFqNfQVPBaYMQAvXoAMHMjsHcO94ngk_rTNa3kztdozFGY5U-kxNRmHDDlKQ6rZ9qByQZ3J8xuDZWrZyHY8GYJbX-pd9HadLDkvFbMcrllPkF3tAABJCjsh4tIt9EDdQobCrijKyStJebACC6IcSqe42qOF_uHxwfNIq15WKophnE6yAnRFpLF_0i8anAnHAEiWVR6vvWzbL8HVC791iyb_klyitxnDqWpTUAFEBrENJp77eXAIwJwuUfYRwAt1T264CXhM7gJ-VfdkYx84HOJFoLPK7pyCFx3y1ioXku_V1tx48GMCHIZFP5RV_plbdcnN4khmA-1c4Uf98Oljif_4z9MGbnxXbsCf2Pk62zKau7oHXE6EBNzaZd0bn4kh7Pd51ldYi7viSIFKRSHkAgw'
      }
    });
    const json = response.data;

    return {
      items: json.result ?? [],
      excludedFrom: json.date_filter?.excluded_from ?? null,
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};
