import styles from './layout.module.css';

const Layout = ({ children }) => {
    return (
        <section className={ styles.dimensions }>
            { children }
        </section>
    );
};

export default Layout;
