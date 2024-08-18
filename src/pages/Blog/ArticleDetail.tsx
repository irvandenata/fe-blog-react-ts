import { Link } from "react-router-dom";

const ArticleDetailPage = () => {

    //set direction to top 
    window.scrollTo(0, 0);
    return (
        <>
            <div className="w-full min-h-screen bg-dark lg:mt-30  text-bodydark">
                <div className="text-center py-20">
                    <h1 className="text-3xl font-bold mb-4">
                        Pembabatan dan Penebangan Liar di Dalam relung Hati
                    </h1>
                    <h2 className="text-lg font-medium mb-4">Programming</h2>
                    <div className="w-full flex justify-center">
                        <p className="text-xs w-39 text-neutral-500 dark:text-white font-bold p-1 rounded-lg bg-primary">
                            2021-10-10
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center mt-6">
                        <div className="px-3 py-1 bg-yellow text-white font-bold grid place-content-center rounded-lg">
                            <h3 className="text-xs 
                            align-middle">Share</h3>
                        </div>
                        <div className="px-3 py-1 bg-yellow text-white font-bold grid place-content-center rounded-lg">
                            <h3 className="text-xs 
                            align-middle">Share</h3>
                        </div>
                        <div className="px-3 py-1 bg-yellow text-white font-bold grid place-content-center rounded-lg">
                            <h3 className="text-xs 
                            align-middle">Share</h3>
                        </div>
                    </div>
                </div>
                <div id="article-image" className="w-full px-5 mb-20 h-[600px]">
                    <img
                        src="https://picsum.photos/id/237/200/300"
                        alt="article"
                        className="w-full   rounded-xl border-2 border-bodydark2 h-full object-cover"
                    />
                </div>
                <div
                    className="w-full mb-20 px-50"
                    style={{
                        // width: "calc(100% - 100px)",
                        // margin: "0 auto",
                        textAlign: "justify",
                    }}
                >
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit
                        . Quisquam, tempora. Quos, doloremque. Quod, quas
                        voluptates. Quisquam, tempora. Quos, doloremque. Quod,
                        quas voluptates. Quisquam, tempora. Quos, doloremque.
                        Quod, quas voluptates. Quisquam, tempora. Quos,
                        <br />
                        <br />
                        doloremque. Quod, quas voluptates. Quisquam, tempora.
                        Quos, doloremque. Quod, quas voluptates. Quisquam,
                        tempora. Quos, doloremque. Quod, quas voluptates.
                    </p>
                </div>
            </div>
        </>
    );
};

export default ArticleDetailPage;
