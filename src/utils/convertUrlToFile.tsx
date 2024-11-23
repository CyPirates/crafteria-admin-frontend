export const convertImageUrlToFile = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error("이미지를 받을 수 없습니다.");
    }
    const data = await response.blob();
    const ext = imageUrl.split(".").pop() || "";
    const filename = imageUrl.split("/").pop() || "";
    const metadata = { type: `image/${ext}` };
    const file = new File([data], filename, metadata);
    // 여기서 file을 return하면 File
    return file;
    // const dataTransfer = new DataTransfer();
    // dataTransfer.items.add(file);
    // return dataTransfer.files;
};

// export const convertImageUrlToFile = async (imageUrl: string, fileName: string): Promise<File> => {
//     const response = await fetch(imageUrl);
//     const blob = await response.blob(); // Blob으로 변환
//     console.log("asd: " + blob);
//     return new File([blob], fileName, { type: blob.type }); // File 객체 생성
// };
