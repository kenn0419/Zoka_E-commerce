import { Button, Carousel } from "antd";
import styles from "./HeroBanner.module.scss";

export default function HeroBanner() {
  return (
    <div className={styles.heroWrapper}>
      <Carousel autoplay dots className={styles.carousel}>
        <div>
          <div
            className={styles.slide}
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1519389950473-47ba0277781c)",
            }}
          >
            <div className={styles.overlay}>
              <span className={styles.badge}>New Arrival</span>
              <h1>
                Step into the <span>Future</span>
              </h1>
              <Button type="primary" size="large">
                Explore Now
              </Button>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div>
          <div
            className={styles.slide}
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1492724441997-5dc865305da7)",
            }}
          >
            <div className={styles.overlay}>
              <span className={styles.badge}>Mega Sale</span>
              <h1>
                Upgrade Your <span>Setup</span>
              </h1>
              <Button type="primary" size="large">
                Shop Deals
              </Button>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
