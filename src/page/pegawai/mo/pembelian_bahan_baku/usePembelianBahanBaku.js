import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  addPembelianBahanBaku,
  getPembelianBahanBaku,
  updatePembelianBahanBaku,
  deleatePembelianBahanBaku,
} from "../../../../api/ApiPembelianBahanBaku";
import { toast } from "sonner";
import { PAGE_SIZE } from "../../../../utils/Constants";

export function usePembelianBahanBaku(handleOpenDelete) {
  // handleOpen, handleOpenDelete
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const search = !searchParams.get("search") ? "" : searchParams.get("search");
  const navigate = useNavigate();
  useEffect(() => {
    fetchData(page, search);
  }, [page, search]);

  useEffect(() => {
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  }, [search]);

  const fetchData = (page, search) => {
    setIsLoading(true);
    getPembelianBahanBaku(page, search)
      .then((res) => {
        setData(res.data);
        setTotalData(res.total);
        setIsLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setIsLoading(false);
      });
  };

  const createData = (input) => {
    setIsProcessing(true);
    addPembelianBahanBaku(input)
      .then(() => {
        setIsProcessing(false);
        fetchData(page, search);
        toast.success("Data berhasil ditambahkan");
        navigate("/pembelian-bahan-baku");
      })
      .catch((err) => {
        setIsProcessing(false);
        toast.error(err.message);
      });
  };

  const updateData = (id, input) => {
    setIsProcessing(true);
    console.log(input);
    updatePembelianBahanBaku(id, input)
      .then((res) => {
        console.log(res);
        setIsProcessing(false);
        fetchData(page, search);
        navigate("/pembelian-bahan-baku");
        toast.success("Data berhasil diupdate");
      })
      .catch((err) => {
        setIsProcessing(false);
        toast.error(err.message);
      });
  };

  const deleteData = (id) => {
    setIsProcessing(true);
    deleatePembelianBahanBaku(id)
      .then(() => {
        setIsProcessing(false);
        const dataLength = data.length - 1;
        if (dataLength % PAGE_SIZE === 0) {
          searchParams.set("page", Math.max(1, page - 1));
          setSearchParams(searchParams);
        } else {
          fetchData(page, search);
        }
        handleOpenDelete();
        toast.success("Data berhasil dihapus");
      })
      .catch((err) => {
        setIsProcessing(false);
        toast.error(err.message);
      });
  };

  return {
    data,
    totalData,
    isLoading,
    isProcessing,
    createData,
    updateData,
    deleteData,
  };
}
